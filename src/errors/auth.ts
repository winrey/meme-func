import { CustomError } from './basic';

export class AuthError extends CustomError {
  code = 50000;
  msg = 'Auth Error';
}

export class NeedLoginError extends AuthError {
  code = 50101;
  msg = 'Need Login (OpenId)';
}

export class NeedUnionIdError extends AuthError {
  code = 50102;
  msg = 'Need UnionId';
}

export class NotAllowedDebugError extends AuthError {
  code = 50201;
  msg = 'Not Allowed Debug';
}

export class NotAllowedObjectError extends AuthError {
  code = 50300;
  msg = 'You are not the owner of the object';
}

export default {
  AuthError,
  NeedLoginError,
  NeedUnionIdError,
  NotAllowedDebugError,
};
