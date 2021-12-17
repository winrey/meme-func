import { RequestError, I2JsonOptions, ArgumentError } from "adv-err";

export class NoSuchServiceError extends RequestError {
  code = 20101;
  message = 'No Such Service Name';
  serviceName: string;

  constructor(serviceName: string) {
    super();
    this.serviceName = serviceName;
  }

  toJSON(options: I2JsonOptions) {
    const { serviceName } = this;
    return super.toJSON({ ...options, payload: { serviceName, ...options.payload } });
  }
}

export class NoSuchTypeError extends RequestError {
  code = 20102;
  message = 'No Such Type Name in Service';
  typeName: string;
  serviceName: string;

  constructor(typeName: string, serviceName: string) {
    super();
    this.typeName = typeName;
    this.serviceName = serviceName;
  }

  toJSON(options: I2JsonOptions) {
    const { typeName, serviceName } = this;
    return super.toJSON({ ...options, payload: { typeName, serviceName, ...options.payload } });
  }
}

export class ArgumentShouldBeObjectError extends ArgumentError {
  code = 21001;
  message = 'Argument Should Be Object Error';
}

export class OperatedObjDoNotHaveId extends ArgumentError {
  code = 21002;
  message = 'Operated Object Do Not Have a _id';
}
