import { Failure } from 'adv-err';

export class LogNotReadyFailure extends Failure {
  name = 'LogNotReadyFailure';
  message = 'Log Not Ready Failure';
}

export class DatabaseResultNotObjFailure extends Failure {
  name = 'DatabaseResultNotObjFailure';
  message = 'Database Result Not Object';
}

export class DatabaseUpdateFailure extends Failure {
  name = 'DatabaseUpdateFailure';
  message = 'Database Update Failure';
}

export class NoAuthInfoFailure extends Failure {
  name = 'NoAuthInfoFailure';
  message = 'No Auth Info: User Not Login';
}

export class NoAppIdFailure extends Failure {
  name = 'NoAppIdFailure';
  message = 'No Auth Info: User Not Login';
}

export class NoUnionIdFailure extends Failure {
  name = 'NoUnionIdFailure';
  message = 'No UnionId and Cannot Find in Union-Open Map';
}

export class CreateUserFailure extends Failure {
  name = 'CreateUserFailure';
  message = 'Create User Failed';
}

export class RegisterDuplicateFailure extends Failure {
  name = 'RegisterDuplicateFailure';
  message = 'Register Duplicate Failure';
}

export class DataAlreadyHaveOwnerFailure extends Failure {
  name = 'DataAlreadyHaveOwnerFailure';
  message = 'Data Already Have Owner Failure';
}
