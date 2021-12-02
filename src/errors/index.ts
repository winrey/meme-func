import auth from './auth'
import basic from './basic';
import { catchError } from './catch';
import cloud from './cloud';
import failure from './failure';
import notFound from './notFound';
import request from './request';
import server from './server';

export default {
  catchError,
  ...basic,
  failure,
  ...failure,
  auth,
  ...auth,
  cloud,
  ...cloud,
  notFound,
  ...notFound,
  request,
  ...request,
  server,
  ...server,
};
