import { AsyncLocalStorage } from 'async_hooks';
import { Failure } from '../errors/failure';
import { ILogger } from '../logger';
import { CloudInputArgumentType } from '../typings/args';

type ReqContext = { request: CloudInputArgumentType; logger?: ILogger };

const contextStorage = new AsyncLocalStorage<ReqContext>();

export const initContext = async (context: ReqContext, inner?: () => Promise<void>) => {
  if (inner) {
    return await contextStorage.run(context, async () => {
      return await inner();
    });
  }
  contextStorage.enterWith(context)
};

export const getRequest = () => {
  const { request } = contextStorage.getStore() || {};
  if (!request) {
    throw new Failure('not in meme init!');
  }
  return request as CloudInputArgumentType;
};

export const getEvent = () => {
  const { event } = getRequest();
  return event;
};

export const getContext = () => {
  const { context } = getRequest();
  return context;
};

export const getLogger = () => {
  const { logger } = contextStorage.getStore() || {};
  if (!logger) {
    console.warn("Logger Not Provided. Use Default console instead.")
    return console
  }
  return logger
};
