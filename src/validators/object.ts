import { Validator } from './validator';

export class IsObjectValidator extends Validator<object> {
  async doValidate(value: object | unknown): Promise<boolean> {
    return typeof value === 'object';
  }
}
