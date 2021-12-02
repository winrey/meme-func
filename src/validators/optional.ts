import { Validator } from './validator';

export class OptionalValidator<T = unknown> extends Validator<T> {
  validator: Validator | Array<Validator>;

  constructor(validator: Validator | Array<Validator>) {
    super();
    this.validator = validator;
  }

  async doValidate(value: T) {
    if (value === undefined) {
      return true;
    }
    if (this.validator instanceof Array) {
      for (const val of this.validator) {
        if (!val.validate(value)) return false;
      }
      return true;
    }
    return this.validator.validate(value);
  }
}
