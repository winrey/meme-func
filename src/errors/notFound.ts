import { NotFoundError } from "adv-err";

export class UserNotFoundError extends NotFoundError {
  code = 40001;
  message = 'User Not Found Error';
}
