import { NotAllowedDebugError } from '../errors/auth';
import { isDebug } from '../utils/getContext';

/**
 * 只能在Debug开启时进入
 */
export const authDebug = async () => {
  if (!isDebug()) {
    throw new NotAllowedDebugError();
  }
  return isDebug();
};
