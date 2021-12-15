import { catchError } from './errors/catch';
// import { initLogger } from './logger';
import { Service, serviceSelector } from './mvc/service';
import { CloudInputArgumentType } from './typings/args';
import { stringUtils } from './utils';
import { initContext, setInstanceDebug } from './utils/getContext';

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

const checkDebug = (forceDebug?: boolean) => {
  if (forceDebug === undefined && process.env.DEBUG !== undefined) {
    forceDebug = stringUtils.toBool(process.env.DEBUG);
  }
  setInstanceDebug(forceDebug);
};

const clearWaiting = () => {
  isReady = true;
  waiting.forEach((r) => setImmediate(() => r()));
  waiting = [];
};

export const initMeme = async ({ isDebug, env, initFunc }: { isDebug?: boolean; env?: symbol | string, initFunc?: () => unknown } = {}) => {
  checkDebug(isDebug);
  let result
  if (initFunc) {
    result = await initFunc()
  }
  clearWaiting();
  if (result) {
    return result
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleMemeReq = async ({
  request,
  isDebug,
  srvs,
}: {
  request: CloudInputArgumentType;
  isDebug?: boolean;
  srvs?: Record<string, Service>;
}) => {
  await ready();
  return await initContext({ request, isDebug }, async () => {
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
