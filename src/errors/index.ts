import auth from './auth';
import basic from './basic';
import { catchError } from './catch';
import failure from './failure';
import notFound from './notFound';
import request from './request';
import server from './server';

export * as authErr from './auth';
export * as basicErr from './basic';
export * as failureErr from './failure';
export * as notFoundErr from './notFound';
export * as requestErr from './request';
export * as serverErr from './server';

export * from './auth';
export * from './basic';
export * from './catch';
export * from './failure';
export * from './notFound';
export * from './request';
export * from './server';

export default {
  catchError,
  ...basic,
  failure,
  ...failure,
  auth,
  ...auth,
  notFound,
  ...notFound,
  request,
  ...request,
  server,
  ...server,
};
