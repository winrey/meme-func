import cloud, { DB } from 'wx-server-sdk';
import { DatabaseResultNotObjFailure } from '../errors/failure';

const CB_DB_CAN_NOT_INSERT_ERROR_CODE = -502001;

interface IDbConfig {
  env?: string;
  /**
   * doc.get 在找不到记录时是否抛出异常，默认为false
   */
  throwOnNotFound?: boolean;
}

export function getDbUtils(config: IDbConfig = {}) {
  const {
    env = cloud.DYNAMIC_CURRENT_ENV,
    // doc.get 在找不到记录时是否抛出异常
    throwOnNotFound = false,
  } = config;
  const db = cloud.database({ env, throwOnNotFound } as any);
  const _ = db.command;
  const $ = db.command.aggregate;
  return { db, _, command: _, $, aggregate: $ };
}

export function getDb(config: IDbConfig = {}) {
  return getDbUtils(config).db;
}

export function checkHasResult<TResultType>(result: TResultType | void | string): TResultType {
  if (!result || typeof result === 'string') {
    throw new DatabaseResultNotObjFailure(result as string);
  } else {
    return result;
  }
}

// export function throwIfNothing<T> (
//   result?: object,
//   errorClass: typeof CustomError | typeof Failure=NotFoundError,

// ): {
//   if (byPass) return result
//   if (!result) {
//     throw new errorClass()
//   }
//   return result
// }

export function addCreatedTime(data: object) {
  const db = getDb();
  return { ...data, createdTime: db.serverDate(), updatedTime: db.serverDate() };
}

export function updateTime(data: object) {
  const db = getDb();
  return { ...data, updatedTime: db.serverDate() };
}

export async function getOneOrNull<T>(whereQuery: DB.Query) {
  const result = checkHasResult<DB.IQueryResult>(await whereQuery.limit(1).get());
  const { data } = result;
  return data.length ? (data[0] as T) : null;
}

export async function getDocById<T>(col: DB.CollectionReference, id: DB.DocumentId): Promise<T> {
  const result = await col.doc(id).get();
  if (!result || typeof result === 'string') {
    throw new DatabaseResultNotObjFailure(result as string);
  } else {
    const { data } = result;
    return data as T;
  }
}

/**
 * 尝试添加记录
 * @param col
 * @returns 添加成功发挥id； 如果集合中已有（唯一性约束），返回false
 */
export async function tryCreate(col: DB.CollectionReference, data: object, autoAddCreatedTime = true) {
  if (autoAddCreatedTime) {
    data = addCreatedTime(data);
  }
  try {
    const { _id } = checkHasResult<DB.IAddResult>(await col.add({ data }));
    return _id;
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
export async function tryUpdate(whereQuery: DB.Query, updateContent = {}, autoUpatedTime = true) {
  if (autoUpatedTime) {
    updateContent = updateTime(updateContent);
  }
  const result = await whereQuery.update({ data: updateContent });
  if (!result) {
    return 0;
  }
  return result.stats.updated;
}

export async function updateByDoc(doc: DB.DocumentReference, updateContent = {}, autoUpatedTime = true) {
  if (autoUpatedTime) {
    updateContent = updateTime(updateContent);
  }
  const result = checkHasResult<DB.IUpdateResult>(await doc.update({ data: updateContent }));
  return result.stats.updated;
}

export abstract class Dao {}
