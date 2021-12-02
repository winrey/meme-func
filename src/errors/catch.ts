import { CustomError, makeErrorBasicRes } from './basic';
import { logFailure } from '../logger';
import { Failure } from './failure';
import { ServerInternalError } from './server';
import { isDebug } from '../utils/getContext';

export const catchError = async (func: CallableFunction) => {
  try {
    return await func();
  } catch (e) {
    if (e instanceof CustomError) {
      return e.makeRes();
    }
    if (e instanceof Failure) {
      // 服务器已知错误（可预料）
      logFailure(e);
    }
    // TODO: 可以考虑以后上报sentry
    if (isDebug()) {
      // 服务器未知错误
      throw e;
    } else {
      const err = new ServerInternalError();
      return makeErrorBasicRes(err.code, err.msg);
    }
  }
};
