import errors from './errors';
import auths from './auths';
import mvc from './mvc';
import init from './init';

export default {
  auths,
  ...auths,
  errors,
  ...errors,
  mvc,
  ...mvc,
  init,
  ...init,
};
