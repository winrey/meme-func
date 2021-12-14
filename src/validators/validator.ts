import { NotImplementFailure } from '../errors/failure';
import { andValidator, orValidator } from './logic';

export class Validator<T = unknown> {

  static and = andValidator
  static or = orValidator

  // eslint-disable-next-line
  async validate(value: T | any) {
    return await this.doValidate(value);
  }

  // eslint-disable-next-line
  async doValidate(value: T | any): Promise<boolean> {
    throw new NotImplementFailure();
  }
}
