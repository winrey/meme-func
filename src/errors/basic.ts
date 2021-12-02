/**
 * 0：无错误
 * 1：未分类错误
 * 2：请求错误
 * 3：外部系统错误
 * 4：找不到资源
 * 5：权限错误
 * 6：内部错误
 */

/**
 * 生成一个含有错误的返回
 * @param {Number} errCode
 * @param {String} msg
 * @param {Object} payload
 * @returns
 */
export const makeErrorBasicRes = (errCode: number, msg: string, payload = {}) => {
  return {
    ...payload,
    errCode,
    msg,
  };
};

export const CODE_OK = 0;

export class CustomError extends Error {
  code = 10001;
  msg = 'Unknow Error';
  custom_msg = '';

  constructor(message?: string) {
    super(message);
    this.name = 'CustomError';
    this.custom_msg = message || '';
    Error.captureStackTrace(this, this.constructor);
  }

  getMsg(msg?: string) {
    return `[ERROR] ${this.code}: ${msg || `${this.msg} ${this.custom_msg || ''}`}`;
  }

  makeRes(payload?: object) {
    return makeErrorBasicRes(this.code, this.getMsg(), payload);
  }
}

export default {
  makeErrorBasicRes,
  CODE_OK,
  CustomError,
}
