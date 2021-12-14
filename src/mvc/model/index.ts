import { DB } from 'wx-server-sdk';

type CanOptional<Type, TOptional> = TOptional extends true ? Type | undefined : Type;

export interface ITimeModelMixin<TOptional=false> {
  createdTime: CanOptional<Date, TOptional>;
  updatedTime: CanOptional<Date, TOptional>;
}

export interface IDeletedModelMixin<TOptional=true>  {
  deletedTime: CanOptional<Date, TOptional>;
}

export interface IOwnerModelMixin<TOptional=false> {
  owner: CanOptional<string, TOptional>;
}

export interface IModel<TOptional=false> {
  _id: CanOptional<DB.DocumentId, TOptional>;
}

export interface IModelWithTime<TOptional=false> extends IModel<TOptional>, ITimeModelMixin<TOptional> {}

export interface IModelWithTimeAndOwner<TOptional=false> extends IModel<TOptional>, ITimeModelMixin<TOptional>, IOwnerModelMixin<TOptional> {}
