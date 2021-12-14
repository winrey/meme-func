import { DB } from "wx-server-sdk";
import { getDb } from "./db";

export function addCreatedTime<T = Record<string, unknown>>(data: T) {
  const db = getDb();
  return { ...data, createdTime: db.serverDate(), updatedTime: db.serverDate() } as T & {
    createdTime: DB.ServerDate,
    updatedTime: DB.ServerDate,
  };
}

export function addCreatedTimeOnly<T = Record<string, unknown>>(data: object) {
  const db = getDb();
  return { ...data, createdTime: db.serverDate() } as T & {
    createdTime: DB.ServerDate,
  };
}

export function updateTime<T = Record<string, unknown>>(data: object) {
  const db = getDb();
  return { ...data, updatedTime: db.serverDate() } as T & {
    updatedTime: DB.ServerDate,
  };
}
