import { readSync } from 'fs';
import { catchError } from './errors/catch';
import { initLogger } from './logger';
import { Service, serviceSelector } from './mvc/service';
import { CloudInputArgumentType } from './typings/args';
import { initContext, setInstanceDebug } from './utils/getContext';
import { wxCloudInit } from './utils/wx-cloud';

let waiting: any[] = []
let isReady = false

const ready = () => {
  return new Promise<void>(resolve => {
    if (isReady) {
      resolve()
      return
    }
    waiting.push(resolve)
  })
}

export const initMeme = async ({ isDebug, env }: { isDebug?: boolean; env?: symbol | string } = {}) => {
  setInstanceDebug(isDebug);
  wxCloudInit({ env });
  isReady = true
  waiting.forEach(r => setImmediate(() => r()))
  waiting = []
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
  await ready()
  return await initContext({ request, isDebug }, async () => {
    return await catchError(async () => {
      return await initLogger(request.event, request.context, async () => {
        return await serviceSelector(
          {
            event: request.event,
            context: request.context,
          },
          srvs,
        );
      });
    });
  });
};

export default {
  initMeme,
  handleMemeReq,
};
