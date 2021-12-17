import { AuthError } from "adv-err";

export class NeedUnionIdError extends AuthError {
  code = 50102;
  message = 'Need UnionId';
}

