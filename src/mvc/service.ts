import { AuthType, checkAuth } from '../auths';
import { AuthError } from '../errors/auth';
import { NoSuchServiceError, NoSuchTypeError, WrongReqError } from '../errors/request';
import { CloudInputArgumentType } from '../typings/args';
import { getClassName } from '../utils/getClassName';
import { Controller } from './controller';
import { defaultSrvs } from './register';

export class Service {
  auth?: AuthType;
  controllers: { [index: string]: Controller } = {};
  static entrance = new Map<unknown, Record<string, string>>();

  private getClassEntrance() {
    const key = Object.getPrototypeOf(this);
    let result = Service.entrance.get(key);
    if (!result) {
      result = {};
      Service.entrance.set(key, result);
    }
    return result;
  }

  async assertAuth({ event, context }: CloudInputArgumentType) {
    if (this.auth) {
      if (!(await checkAuth(this.auth, { event, context }))) {
        throw new AuthError(`Cannot match Service "${getClassName(this)}" Auth`);
      }
    }
  }

  async main({ event, context }: CloudInputArgumentType) {
    // 检测服务权限
    await this.assertAuth({ event, context });
    // 检测controller服务权限
    const type = event.type;
    if (!type) {
      throw new WrongReqError("Cannot Find 'type' In Request");
    }
    const entrance = this.getClassEntrance()[type];
    if (entrance) {
      return await (this as any)[entrance].call(this, event, context);
    }
    const controller = this.controllers[type];
    if (!controller) {
      throw new NoSuchTypeError(type, event.service);
    }
    return controller.execute({ event, context });
  }
}

export const entrance = (name?: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // target.entrance[name ?? propertyKey] = propertyKey
    const key = name ?? propertyKey;
    let entrance = Service.entrance.get(target);
    if (!entrance) {
      entrance = {};
      Service.entrance.set(target, entrance);
    }
    entrance[key] = propertyKey;
  };
};

export const serviceSelector = async (
  { event, context }: CloudInputArgumentType,
  srvs?: { [index: string]: Service },
  key = 'service',
) => {
  if (!srvs) {
    srvs = defaultSrvs;
  }
  if (!event || !event[key]) {
    throw new WrongReqError("Cannot Find 'service' In Request");
  }
  const id = event[key];
  if (!srvs[id] || !(srvs[id] instanceof Service)) {
    throw new NoSuchServiceError(id);
  }
  return await srvs[id].main({ event, context });
};

// export const TypeFunc =
