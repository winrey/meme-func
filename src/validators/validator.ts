import { NotImplementFailure } from '../errors/failure';

export class Validator<T = unknown> {
  // eslint-disable-next-line
  async validate(value: T | any) {
    return await this.doValidate(value);
  }

  // eslint-disable-next-line
  async doValidate(value: T | any): Promise<boolean> {
    throw new NotImplementFailure();
  }
}
