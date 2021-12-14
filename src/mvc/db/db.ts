import cloud from 'wx-server-sdk';
import { DatabaseResultNotObjFailure } from '../../errors/failure';

export interface IDbConfig {
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
    throwOnNotFound = true,
  } = config;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
