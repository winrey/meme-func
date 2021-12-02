import { CustomError } from './basic';

export class WrongReqError extends CustomError {
  code = 20100;
  msg = 'Wrong Request';
}

export class NoSuchServiceError extends WrongReqError {
  code = 20101;
  msg = 'No Such Service Name';
  serviceName: string;

  constructor(serviceName: string) {
    super();
    this.serviceName = serviceName;
  }

  makeRes() {
    const { serviceName } = this;
    return super.makeRes({ serviceName });
  }
}

export class NoSuchTypeError extends WrongReqError {
  code = 20102;
  msg = 'No Such Type Name in Service';
  typeName: string;
  serviceName: string;

  constructor(typeName: string, serviceName: string) {
    super();
    this.typeName = typeName;
    this.serviceName = serviceName;
  }

  makeRes() {
    const { typeName, serviceName } = this;
    return super.makeRes({ typeName, serviceName });
  }
}

export class ArgumentError extends WrongReqError {
  code = 20200;
  msg = 'Argument Error';
}

export class ArgumentShouldBeObjectError extends ArgumentError {
  code = 20201;
  msg = 'Argument Should Be Object Error';
}

export default {
  WrongReqError,
  NoSuchServiceError,
  NoSuchTypeError,
  ArgumentError,
  ArgumentShouldBeObjectError,
};
