import { DB } from "wx-server-sdk";
import { Dao } from ".";
import { DataAlreadyHaveOwnerFailure, Failure } from '../../../errors/failure';
import { checkHasResult, getDb } from "../db";
import { IModel, IOwnerModelMixin } from "../../model";
import { OperatedObjDoNotHaveId } from "../../../errors/request";
import { getDocById, doCreate, updateByDoc } from "../operation";
import { NotAllowedObjectError } from "../../../errors/auth";
import { hardDelete } from "..";

let defaultGetCurrentUserId: (() => Promise<string>) | undefined

export class OwnerDao extends Dao {
  ownerKey = "owner"
  getCurrentUserId?: () => Promise<string>
  col: DB.CollectionReference

  constructor({ col, ownerKey, getCurrentUserId }: {
    col: DB.CollectionReference | string,
    ownerKey?: string, 
    getCurrentUserId?: () => Promise<string>,
  }) {
    super();
    if (typeof col === "string") {
      col = getDb().collection(col)
    }
    this.col = col
    this.ownerKey = ownerKey ?? this.ownerKey
    this.getCurrentUserId = getCurrentUserId
  }

  static setDefaultGetCurrentUserId(func: () => Promise<string>) {
    defaultGetCurrentUserId = func
  }

  private async getCurrent() {
    if (this.getCurrentUserId) {
      return await this.getCurrentUserId()
    }
    if (defaultGetCurrentUserId) {
      return await defaultGetCurrentUserId()
    }
    throw new Failure("OwnerDao do not have a get_user function")
  }

  async addOwnerToData(data: Record<string, unknown>) {
    if (data[this.ownerKey]) {
      throw new DataAlreadyHaveOwnerFailure()
    }
    return await this.updateOwnerToData(data)
  }

  async updateOwnerToData(data: Record<string, unknown>) {
    data[this.ownerKey] = await this.getCurrent()
    return data 
  }

  private async getOwnerWhereSelector(whereCondition = {}) {
    const current = await this.getCurrent()
    return { 
      [this.ownerKey]: current, 
      ...whereCondition
    }
  }

  async getByOwner(whereCondition = {}) {
    const where = await this.getOwnerWhereSelector(whereCondition)
    const { data } = checkHasResult<DB.IQueryResult>(
      await this.col.where(where).get()
    )
    return data
  }

  async add(data: Record<string, unknown>, owner?: string) {
    if (!owner) {
      owner = await this.getCurrent()
    }
    data = await this.addOwnerToData(data)
    const id = await doCreate(this.col, data)
    return id
  }

  private transToId(data: IModel | string, text?: string) {
    if (typeof data !== 'string'){
      return this.ensureModelDataHaveId(data, text)
    }
    return data
  }

  async checkOwner(data: IModel | string) {
    const id = this.transToId(data)
    const obj: any = await getDocById(this.col, id)
    const current = await this.getCurrent()
    return !obj[this.ownerKey] || obj[this.ownerKey] === current
  }

  async ensureOwner(data: IModel | string) {
    const id = this.transToId(data)
    const obj: any = await getDocById<IOwnerModelMixin>(this.col, id)
    const current = await this.getCurrent()
    if (obj[this.ownerKey] && obj[this.ownerKey] !== current) {
      throw new NotAllowedObjectError()
    }
    // const dataOwner = (data as any)[this.ownerKey]
    // if(
    //   dataOwner && 
    //   obj[this.ownerKey] && 
    //   dataOwner !== obj[this.ownerKey]
    // ) {
    //   throw new NotAllowedObjectError()
    // }
    return obj
  }

  private ensureModelDataHaveId(data: any, text?: string){
    const { _id } = data
    if (!_id) {
      throw new OperatedObjDoNotHaveId(text)
    }
    return _id as string
  }

  async updateById(
    data: IModel, 
    { checkOwner = true, autoOwner = true } = {}
  ) {
    this.ensureModelDataHaveId(data, "Updated Object Do not Have an _id")
    if (checkOwner) {
      await this.ensureOwner(data)
    }
    if (autoOwner) {
      data = await this.updateOwnerToData(data as any) as any
    }
    const { _id, ...rest } = data
    return updateByDoc(this.col.doc(_id), rest)
  }

  async deleteById(data: IModel | string, { checkOwner = true } = {}) {
    if (typeof data !== 'string'){
      data = this.transToId(data, "Deleted Object Do not Have an _id")
    }
    
    if (checkOwner) {
      await this.ensureOwner(data)
    }
    return await hardDelete(this.col.doc(data))
  }

  // async checkAuth(object) {

  // }
}
