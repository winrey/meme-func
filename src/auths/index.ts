import { NotImplementFailure } from "../errors/failure";
import { CloudInputArgumentType } from "../typings/args";

export class Auth {
  async check(): Promise<boolean> {
    throw new NotImplementFailure()
  }

  static and(auths: AuthType[]) {
    return authAnd(auths)
  }

  static or(auths: AuthType[]) {
    return authOr(auths)
  }
}

export type AuthType = Auth | ((args: CloudInputArgumentType) => Promise<boolean>)

export async function checkAuth(auth: AuthType, {event, context}: CloudInputArgumentType) {
  if (!auth) return true
  if (auth instanceof Auth) {
    return await auth.check()
  }
  return await auth({event, context})
}


export const authAnd = (auths: AuthType[]) => async ({event, context}: CloudInputArgumentType) => {
  for(const auth of auths) {
    if (!await checkAuth(auth, {event, context})) {
      return false
    }
  }
}

export const authOr = (auths: AuthType[]) => async ({event, context}: CloudInputArgumentType) => {
  for(const auth of auths) {
    try {
      if (await checkAuth(auth, {event, context})) {
        return true
      }
    } catch {}
  }
  return false
}
