import { catchError } from './errors/catch';
import { initLogger } from './logger';
import { Service, serviceSelector } from './mvc/service';
import { CloudInputArgumentType } from './typings/args';
import { initContext, setInstanceDebug } from './utils/getContext';
import { wxCloudInit } from './utils/wx-cloud';

export const initMeme = async ({ isDebug, env }: { isDebug?: boolean; env?: symbol | string } = {}) => {
  setInstanceDebug(isDebug);
  wxCloudInit({ env });
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
  return await initContext({ request, isDebug }, async () => {
    return await initLogger(request.event, request.context, async () => {
      return await catchError(async () => {
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
