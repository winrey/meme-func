import { CustomError } from "."

export class AuthError extends CustomError {
  code = 50000
  msg = "Auth Error"
}

export class NeedLoginError extends AuthError {
  code = 50101
  msg = "Need Login (OpenId)"
}

export class NeedUnionIdError extends AuthError {
  code = 50102
  msg = "Need UnionId"
}

export class NotAllowedDebugError extends AuthError {
  code = 50201
  msg = "Not Allowed Debug"
}
