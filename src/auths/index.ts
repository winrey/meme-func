import { AuthError } from '../errors/auth';
import { NotImplementFailure } from '../errors/failure';
import { Service } from '../mvc/service';
import { CloudInputArgumentType, ContextType } from '../typings/args';

export class Auth {
  async check(request: CloudInputArgumentType): Promise<boolean> {
    throw new NotImplementFailure();
  }

  static and(auths: AuthType[]) {
    return authAnd(auths);
  }

  static or(auths: AuthType[]) {
    return authOr(auths);
  }
}

export type AuthType = Auth | ((args: CloudInputArgumentType) => Promise<boolean>);

export async function checkAuth(auth: AuthType, request: CloudInputArgumentType) {
  if (!auth) return true;
  if (auth instanceof Auth) {
    return await auth.check(request);
  }
  return await auth(request);
}

export const authAnd =
  (auths: AuthType[]) =>
  async ({ event, context }: CloudInputArgumentType) => {
    for (const auth of auths) {
      if (!(await checkAuth(auth, { event, context }))) {
        return false;
      }
    }
  };

export const authOr =
  (auths: AuthType[]) =>
  async ({ event, context }: CloudInputArgumentType) => {
    for (const auth of auths) {
      try {
        if (await checkAuth(auth, { event, context })) {
          return true;
        }
      // eslint-disable-next-line no-empty
      } catch {}
    }
    return false;
  };

  /**
   * Auth Decorator
   */
export const needAuth = (auth: AuthType) => {
  return (target: typeof Service, propertyKey: string, descriptor: PropertyDescriptor) => {
    const old = descriptor.value;
    descriptor.value = function (event: Record<string, unknown>, context: ContextType) {
      if (!checkAuth(auth, { event, context })) {
        throw new AuthError()
      }
      const result = old.call(this, event, context);
      return result;
    };
  };
};

export default {
  Auth, 
  checkAuth,
  authAnd,
  authOr,
}
