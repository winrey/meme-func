import { WrongArgumentFailure } from "../errors/failure";
import { Validator } from "./validator";

export interface IValidatorObject {
  [key: string]: ValidatorType;
}

export type ValidatorType = IValidatorObject | Validator | Validator[]

async function validateArr(validators: Validator[], value: any) {
  for (const v of validators) {
    if (!await v.validate(value)) {
      return false
    }
  }
  return true
}

async function validateObj(validatorObj: IValidatorObject, value: any): Promise<boolean> {
  if (!value) {
    return false
  }
  for (const [key, validator] of Object.entries(validatorObj)) {
    if(!await validate(validator, value[key])) 
      return false
  }
  return true
}

export async function validate(validated: ValidatorType | undefined, value: any) {
  if (!validated) {
    return true
  }
  if (validated instanceof Validator) {
    return await validated.validate(value)
  }
  if (validated instanceof Array) {
    return await validateArr(validated, value)
  }
  if (validated instanceof Object) {
    return await validateObj(validated, value)
  }
  throw new WrongArgumentFailure()
}
