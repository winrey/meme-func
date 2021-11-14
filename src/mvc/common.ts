import { DB } from "wx-server-sdk";

export interface ITimeModalMixin {
  createdTime: Date,
  updatedTime: Date,
}

export interface IModal {
  _id: DB.DocumentId
}

export interface IModalWithTime 
  extends IModal, ITimeModalMixin {}

