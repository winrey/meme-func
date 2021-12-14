import { DB } from 'wx-server-sdk';
import { DatabaseUpdateFailure } from '../../errors/failure';
import { IModel } from '../model';
import { CB_DB_CAN_NOT_INSERT_ERROR_CODE, CB_ERR_CODE_NOT_FOUND_DOC, CB_ERR_MSG_NOT_FOUND_DOC } from './const';
import { addCreatedTime, addCreatedTimeOnly, updateTime } from './data';
import { checkHasResult, getDbUtils } from "./db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNotFoundDocIdErr = (err: any) => 
    (typeof err === "object") &&
      err.errCode === CB_ERR_CODE_NOT_FOUND_DOC &&
      err.errMsg === CB_ERR_MSG_NOT_FOUND_DOC


export async function getOneOrNull<T>(whereQuery: DB.Query) {
  const result = checkHasResult<DB.IQueryResult>(await whereQuery.limit(1).get());
  const { data } = result;
  return data.length ? (data[0] as T) : null;
}

export async function getDoc<T>(doc: DB.DocumentReference): Promise<T> {
  const result = checkHasResult<DB.IQuerySingleResult>(await doc.get())
  const { data } = result;
  return data as T;
}

export async function getDocById<T>(col: DB.CollectionReference, id: DB.DocumentId): Promise<T> {
  return await getDoc<T>(col.doc(id))
}

/**
 * 尝试添加记录
 * @param col
 * @returns 添加成功发挥id； 如果集合中已有（唯一性约束），返回false
 */
export async function doCreate(col: DB.CollectionReference, data: object, autoAddCreatedTime = true) {
  if (autoAddCreatedTime) {
    data = addCreatedTime(data);
  }
  try {
    const { _id } = checkHasResult<DB.IAddResult>(await col.add({ data }));
    return _id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e && e.errCode === CB_DB_CAN_NOT_INSERT_ERROR_CODE) {
      return false;
    }
    throw e;
  }
}

/**
 * 尝试自动更新字段
 * @param whereQuery
 * @param updateContent
 * @param autoUpatedTime
 * @returns 返回更新的数量
 */
export async function doUpdate(whereQuery: DB.Query, updateContent = {}, 
  { autoUpatedTime = true } = {}
) {
  if (autoUpatedTime) {
    updateContent = updateTime(updateContent);
  }
  const result = await whereQuery.update({ data: updateContent });
  if (!result) {
    return 0;
  }
  return result.stats.updated;
}

export async function upsert(
  col: DB.CollectionReference, 
  condition: object, 
  data = {}, 
  { mergeConditionToDataWhenCreate = true, autoAddTime=true }: {
    mergeConditionToDataWhenCreate?: boolean,
    autoAddTime?: boolean
  } = {}
) {
  const old = await getOneOrNull<IModel>(col.where(condition))
  if (old) {
    // update
    const id = old._id
    let updated = { ...old, ...data }
    if (autoAddTime) {
      updated = updateTime(updateTime)
    }
    await col.doc(id).set({ data: updated })
    return id
  }
  // create
  if (mergeConditionToDataWhenCreate) {
    data = { ...condition, ...data }
  }
  const id = await doCreate(col, data ,autoAddTime)
  if (!id) {
    throw new DatabaseUpdateFailure()
  }
  return id
}

export async function updateByDoc(doc: DB.DocumentReference, updateContent = {}, autoUpatedTime = true) {
  if (autoUpatedTime) {
    updateContent = updateTime(updateContent);
  }
  const result = checkHasResult<DB.IUpdateResult>(await doc.update({ data: updateContent }));
  return result.stats.updated;
}

export async function tryReplace(doc: DB.DocumentReference, data: Record<string, unknown>, { autoUpatedTime = true, inheritOldCreatedTime = true, refreshCreatedTime = false } = {}) {
  if (autoUpatedTime) {
    data = updateTime<Record<string, unknown>>(data)
  }
  if (refreshCreatedTime) {
    data = addCreatedTimeOnly(data)
  } else if(inheritOldCreatedTime) {
    const old = await getDoc<{createdTime?: string}>(doc)
    if (!old.createdTime) {
      data.createdTime = old.createdTime
    } else {
      data = addCreatedTimeOnly(data)
    }
  }
  const result = checkHasResult<DB.IUpdateResult>(
    await doc.set({ data })
    );
  return result.stats.updated;
}

export function whereNotSoftDeleted(whereCondition = {}) {
  const { _ } = getDbUtils()
  return {
    ...whereCondition,
    deletedTime: _.exists(false)
  }
}

export async function hardDelete(whereQuery: DB.Query | DB.DocumentReference) {
  const result = checkHasResult<DB.IRemoveResult>(
    await whereQuery.remove()
  );
  return result.stats.removed;
}

export async function softDelete(whereQuery: DB.Query | DB.DocumentReference) {
  const { db } = getDbUtils()
  const result = checkHasResult<DB.IUpdateResult>(
    await whereQuery.update({
      data: {
        deletedTime: db.serverDate()
      }
    })
  )
  return result.stats.updated
}

export async function retrieveSoftDelete(whereQuery: DB.Query | DB.DocumentReference) {
  const { _ } = getDbUtils()
  const result = checkHasResult<DB.IUpdateResult>(
    await whereQuery.update({
      data: {
        deletedTime: _.remove()
      }
    })
  )
  return result.stats.updated
}
