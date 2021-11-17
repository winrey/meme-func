import { type } from 'os';
import cloud, { ICloud, logger } from 'wx-server-sdk'
import { isDEBUG } from '..';
import { Failure, LogNotReadyFailure } from '../errors/failure';

let wxLog: ICloud.Logger | null = null
let hasInit = false
let event, context

// interface ILogConfig {
//   /** log唯一uuid */
//   // needLogId?: boolean,
//   /** 请求信息 */
//   // needLogToConsole: boolean,
//   /** 请求信息 */
//   // needReqDetail?: boolean,
//   /** wxContext信息 */
//   // needContextDetail?: boolean,
//   /** auth信息 */
//   // needAuthInfo?: boolean,
//   /** 环境变量 */
//   // needEnvVar?: boolean,
//   /** 调用堆栈 */
//   // needCallStack?: boolean,
// }

type LogLevel = "debug" | "info" | "log" | "warn" | "error"
// const logToWxMap = {
//   "debug": ICloud.Logger.prototype.info,
//   "info": ICloud.Logger.prototype.info,
//   "log": ICloud.Logger.prototype.log,
//   "warn": ICloud.Logger.prototype.warn,
//   "error": ICloud.Logger.prototype.error,
// }

let logToWxMap: any = {}

class Logger {
  // constructor() {

  // }

  /**
   * 检查是否可以log
   */
  check() {
    return !!wxLog
  }

  assureCanLog() {
    // 以后要不要搞个await？
    if (!wxLog) {
      throw new LogNotReadyFailure()
    }
  }

  /**
   * 只有DEBUG开启才会log到info频道，会附带isDebug: true
   * @param {*} obj 如果其中如含有type项无效
   * @param {*} type 
   */
  debug(info: object | string, type = "") {
    this._log("debug", info, type)
  }


  /**
   * log到info频道
   * @param {*} obj 如果其中如含有type项无效
   * @param {*} type 
   */
  info(info: object | string, type = "") {
    this._log("info", info, type)
  }

  /**
   * log到log频道
   * @param {*} obj 如果其中如含有type项无效
   * @param {*} type 
   */
  log(info: object | string, type = "") {
    this._log("log", info, type)
  }

  /**
   * log到warn频道
   * @param {*} obj 如果其中如含有type项无效
   * @param {*} type 
   */
  warn(info: object | string, type = "") {
    this._log("warn", info, type)
  }

  /**
   * log到error频道
   * @param {*} obj 如果其中如含有type项无效
   * @param {*} type 
   */
  error(info: object | string, type = "") {
    this._log("error", info, type)
  }

  private _log(level: LogLevel, info: object | string, type="") {
    this.assureCanLog()
    const isLogDebug = level === 'debug'
    if (isLogDebug && !isDEBUG) {
      // 非debug mod不log debug
      return
    }
    const logObj = this.makeLogObj(info, type, isLogDebug)
    const logFunc = console[level]
    if (typeof info === 'string') {
      logFunc?.call(console, info)
    } else {
      logFunc?.call(console, '[wxlog]', info)
    }
    logToWxMap[level].call(wxLog, logObj)
  }

  private makeLogObj(
    info: object | string, 
    type="", isDebug=false,
    // {needEnvDetail=false}: ILogConfig
  ) {
    if (typeof info === 'string') {
      info = this.transMsgToObj(info)
    }
    return { ...info, type, isDebug }
  }

  private transMsgToObj(info: string) {
    return { pureMsg: true, msg: info }
  }
}

export const log = new Logger();

// 一定要在使用前小程序入口main函数里调用！
export const initLogger = (initEvent: any, initContext: any) => {
  wxLog = cloud.logger()
  hasInit = true
  event = initEvent
  context = initContext
  logToWxMap = {
    "debug": wxLog.info,
    "info": wxLog.info,
    "log": wxLog.log,
    "warn": wxLog.warn,
    "error": wxLog.error,
  }
}

export const getLogger = () => {
  if (!hasInit) {
    throw new Failure("logger is not ready")
  }
  return log
}

export const logFailure = (e: Failure) => {
  log.error({
    failureName: e.name,
    msg: e.msg
  }, "failure")
}
