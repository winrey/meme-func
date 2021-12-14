import { AuthType, checkAuth } from '../auths';
import { AuthError } from '../errors/auth';
import { NotImplementFailure } from '../errors/failure';
import { WrongReqError } from '../errors/request';
import { CloudInputArgumentType } from '../typings/args';
import { getClassName } from '../utils/getClassName';
import { validate } from '../validators/basic';
import { Validator } from '../validators/validator';

export class Controller<TEvent = any> {
  auth?: AuthType;
  validators?: { [key: string]: Validator | Array<Validator> };

  async validate({ event, context }: CloudInputArgumentType<TEvent>) {
    if (this.validators) {
      validate(this.validators, event);
    }
    return true;
  }

  async assertAuth({ event, context }: CloudInputArgumentType<TEvent>) {
    if (this.auth) {
      if (!(await checkAuth(this.auth, { event, context }))) {
        throw new AuthError(`Cannot match Type "${getClassName(this)}" Auth`);
      }
    }
  }

  async main({ event, context }: CloudInputArgumentType<TEvent>): Promise<object | null | void | Array<any>> {
    throw new NotImplementFailure();
  }

  async execute({ event, context }: CloudInputArgumentType<TEvent>) {
    if (!(await this.validate({ event, context }))) {
      throw new WrongReqError();
    }
    await this.assertAuth({ event, context });
    return await this.main({ event, context });
  }
}
