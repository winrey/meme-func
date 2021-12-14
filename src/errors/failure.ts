/**
 * Failure为服务器预期外的错误
 */
export class Failure extends Error {
  msg = 'Server Interal Failure';

  constructor(message?: string) {
    super(message);
    this.name = 'Failure';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotImplementFailure extends Failure {
  name = 'NotImplementFailure';
  msg = 'Not Implement Failure';

  constructor(message: undefined | string = '') {
    super(`Not Implement Error ${message}`);
  }
}

export class LogNotReadyFailure extends Failure {
  name = 'LogNotReadyFailure';
  msg = 'Log Not Ready Failure';
}

export class DatabaseResultNotObjFailure extends Failure {
  name = 'DatabaseResultNotObjFailure';
  msg = 'Database Result Not Object';
}

export class DatabaseUpdateFailure extends Failure {
  name = 'DatabaseUpdateFailure';
  msg = 'Database Update Failure';
}

export class NoAuthInfoFailure extends Failure {
  name = 'NoAuthInfoFailure';
  msg = 'No Auth Info: User Not Login';
}

export class NoAppIdFailure extends Failure {
  name = 'NoAppIdFailure';
  msg = 'No Auth Info: User Not Login';
}

export class NoUnionIdFailure extends Failure {
  name = 'NoUnionIdFailure';
  msg = 'No UnionId and Cannot Find in Union-Open Map';
}

export class CreateUserFailure extends Failure {
  name = 'CreateUserFailure';
  msg = 'Create User Failed';
}

export class WrongArgumentFailure extends Failure {
  name = 'WrongArgumentFailure';
  msg = 'Wrong Argument Failure';
}

export class RegisterDuplicateFailure extends Failure {
  name = 'RegisterDuplicateFailure';
  msg = 'Register Duplicate Failure';
}

export class DataAlreadyHaveOwnerFailure extends Failure {
  name = 'DataAlreadyHaveOwnerFailure';
  msg = 'Data Already Have Owner Failure';
}
