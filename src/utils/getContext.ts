import { AsyncLocalStorage } from 'async_hooks';
import { Failure } from '../errors/failure';
import { CloudInputArgumentType } from '../typings/args';

export let _isDebug = false;

export const isDebug = () => {
  const context = contextStorage.getStore();
  if (context && context.isDebug !== undefined) {
    return context.isDebug;
  }
  return _isDebug;
};

type ReqContext = { request: CloudInputArgumentType; isDebug?: boolean };

const contextStorage = new AsyncLocalStorage<ReqContext>();

export const setInstanceDebug = (debug?: boolean) => {
  _isDebug = debug ?? _isDebug;
};

export const initContext = async (context: ReqContext, inner: () => Promise<void>) => {
  return await contextStorage.run(context, async () => {
    return await inner();
  });
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
