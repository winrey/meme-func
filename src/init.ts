import { catchError } from './errors/catch';
// import { initLogger } from './logger';
import { Service, serviceSelector } from './mvc/service';
import { CloudInputArgumentType } from './typings/args';
import { stringUtils } from './utils';
import { initContext, mergeContext } from './utils/getContext';

let waiting: (() => void)[] = [];
let isReady = false;

const ready = () => {
  return new Promise<void>((resolve) => {
    if (isReady) {
      resolve();
      return;
    }
    waiting.push(resolve);
  });
};

const checkDebug = async (forceDebug?: boolean) => {
  if (forceDebug === undefined && process.env.DEBUG !== undefined) {
    forceDebug = stringUtils.toBool(process.env.DEBUG);
  }
  return await mergeContext({ debug: forceDebug });
};

const clearWaiting = () => {
  isReady = true;
  waiting.forEach((r) => setImmediate(() => r()));
  waiting = [];
};

export const initMeme = async ({
  isDebug,
  env,
  initFunc,
}: { isDebug?: boolean; env?: symbol | string; initFunc?: () => unknown } = {}) => {
  await checkDebug(isDebug);
  let result;
  if (initFunc) {
    result = await initFunc();
  }
  clearWaiting();
  if (result) {
    return result;
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleMemeReq = async ({
  request,
  debug,
  srvs,
}: {
  request: CloudInputArgumentType;
  debug?: boolean;
  srvs?: Record<string, Service>;
}) => {
  await ready();
  return await initContext({ request, debug }, async () => {
    // return await initLogger(request.event, request.context, async () => {
    return await catchError(async () => {
      return await serviceSelector(
        {
          event: request.event,
          context: request.context,
        },
        srvs,
      );
    });
    // });
  });
};

export default {
  initMeme,
  handleMemeReq,
};
