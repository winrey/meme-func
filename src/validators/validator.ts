import { NotImplementFailure } from '../errors/failure';

export class Validator<T = any> {
  async validate(value: T | any) {
    return await this.doValidate(value);
  }

  async doValidate(value: T | any): Promise<boolean> {
    throw new NotImplementFailure();
  }
}
