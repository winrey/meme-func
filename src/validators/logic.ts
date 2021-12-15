import { Validator } from '.';
import { validate, validateArr, ValidatorType } from './basic';

export const andValidator = (validators: ValidatorType[]) => async (value: any) => {
  return await validateArr(validators, value);
};

export const orValidator = (validators: ValidatorType[]) => async (value: any) => {
  for (const v of validators) {
    try {
      if (await validate(v, value)) {
        return true;
      }
    } catch (e) {
      continue;
    }
  }
  return false;
};

export class AndValidator extends Validator {
  validators: ValidatorType[];

  constructor(validators: ValidatorType[]) {
    super();
    this.validators = validators;
  }

  async doValidate(value: any): Promise<boolean> {
    return await andValidator(this.validators)(value);
  }
}

export class OrValidator extends Validator {
  validators: ValidatorType[];

  constructor(validators: ValidatorType[]) {
    super();
    this.validators = validators;
  }

  async doValidate(value: any): Promise<boolean> {
    return await orValidator(this.validators)(value);
  }
}
