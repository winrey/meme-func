import { CustomError } from './basic';

export class NotFoundError extends CustomError {
  code = 40000;
  msg = 'Not Found Error';
}

export class UserNotFoundError extends NotFoundError {
  code = 40001;
  msg = 'User Not Found Error';
}
