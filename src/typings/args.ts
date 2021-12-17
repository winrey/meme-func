import { IContext } from '@embassy/interface'

export type ContextType = IContext;
export type CloudInputArgumentType<TEvent = any> = { event: TEvent; context: ContextType };
