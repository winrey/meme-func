export type ContextType = Record<string, unknown>;
export type CloudInputArgumentType<TEvent = any> = { event: TEvent; context: ContextType };
