import { WrongArgumentFailure } from '../errors/failure';
import { ArgumentError } from '../errors/request';
import { Validator } from './validator';

export interface IValidatorObject {
  [key: string]: ValidatorType;
}

export type IValidatorFunc = (value: any) => (boolean | Promise<boolean>)

export type ValidatorType = IValidatorObject 
  | Validator | ValidatorType[] | IValidatorFunc;

export async function validateArr(validators: ValidatorType[], value: any) {
  for (const v of validators) {
    if (!(await validate(v, value))) {
      return false;
    }
  }
  return true;
}

export async function validateObj(validatorObj: IValidatorObject, value: any): Promise<boolean> {
  if (!value) {
    return false;
  }
  for (const [key, validator] of Object.entries(validatorObj)) {
    if (!(await validate(validator, value[key])))
      return false;
  }
  return true;
}

export async function validateFunc(validatorFunc: IValidatorFunc, value: any): Promise<boolean> {
  return await validatorFunc(value);
}

export async function validate(validated: ValidatorType | undefined, value: any) {
  if (!validated) {
    return true;
  }
  if (validated instanceof Validator) {
    return await validated.validate(value);
  }
  if (validated instanceof Array) {
    return await validateArr(validated, value);
  }
  if (validated instanceof Function) {
    return await validateFunc(validated, value);
  }
  if (validated instanceof Object) {
    return await validateObj(validated, value);
  }
  throw new WrongArgumentFailure();
}

export const needValidate = (validated: ValidatorType) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const old = descriptor.value;
    descriptor.value = function (event: Record<string, unknown>, ...args: any[]) {
      if (!validate(validated, event)) {
        throw new ArgumentError();
      }
      const result = old.apply(this, [event, ...args]);
      return result;
    };
  };
};
