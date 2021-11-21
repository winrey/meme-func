import { AuthType, checkAuth } from '../auths';
import { AuthError } from '../errors/auth';
import { NoSuchServiceError, NoSuchTypeError, WrongReqError } from '../errors/request';
import { CloudInputArgumentType } from '../typings/args';
import { getClassName } from '../utils/getClassName';
import { Controller } from './controller';

export class Service {
  auth?: AuthType;
  controllers: { [index: string]: Controller } = {};

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
    const controller = this.controllers[type];
    if (!controller) {
      throw new NoSuchTypeError(type, event.service);
    }
    return controller.execute({ event, context });
  }
}

export const serviceSelector = async (
  srvs: { [index: string]: Service },
  { event, context }: CloudInputArgumentType,
  key = 'service',
) => {
  if (!event || !event[key]) {
    throw new WrongReqError("Cannot Find 'service' In Request");
  }
  const id = event[key];
  if (!srvs[id] || !(srvs[id] instanceof Service)) {
    throw new NoSuchServiceError(id);
  }
  return await srvs[id].main({ event, context });
};
