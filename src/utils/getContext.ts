import { AsyncLocalStorage } from 'async_hooks';
import { Failure } from '../errors/failure';
import { ILogger } from '../logger';
import { CloudInputArgumentType, ContextType } from '../typings/args';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReqContext<TEvent = any> = { event?: TEvent; context?: ContextType; logger?: ILogger; debug?: boolean };

const contextStorage = new AsyncLocalStorage<ReqContext>();

export const setContext = async (context: ReqContext, inner?: () => Promise<void>) => {
  if (inner) {
    return await contextStorage.run(context, async () => {
      return await inner();
    });
  }
  contextStorage.enterWith(context);
};

export const initContext = setContext;

export const mergeContext = async (merged: ReqContext, inner?: () => Promise<void>) => {
  const old = contextStorage.getStore() || {};
  const context = { ...old, ...merged };
  return await setContext(context, inner);
};

export const isDebug = () => {
  const { debug } = contextStorage.getStore() || {};
  return Boolean(debug);
};

export const getRequest = () => {
  const context = getContext();
  const event = getEvent();
  return { event, context };
};

export const getEvent = () => {
  const { event } = contextStorage.getStore() || {};
  return event;
};

export const getContext = () => {
  const { context } = contextStorage.getStore() || {};
  return context;
};

export const getLogger = () => {
  const { logger } = contextStorage.getStore() || {};
  if (!logger) {
    console.warn('Logger Not Provided. Use Default console instead.');
    return console;
  }
  return logger;
};
