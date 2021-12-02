import { WrongReqError } from './request';

export class CloudIdError extends WrongReqError {
  code = 25100;
  msg = 'CloudId Error';
}

export class ShouldBeCloudIdError extends CloudIdError {
  code = 25101;
  msg = 'Argument Should Be CloudId Object';
}

export class CloudIdSourceNotAllowedError extends CloudIdError {
  code = 25102;
  msg = 'CloudId Source appid Not Allowed Error';
}

export class CloudIdSourceExpiredError extends CloudIdError {
  code = 25103;
  msg = 'CloudId Source Expired Error';
}

export class CloudIdSourceInvalidError extends CloudIdError {
  code = 25104;
  msg = 'CloudId Source Invalid Error';
}

export default {
  CloudIdError,
  ShouldBeCloudIdError,
  CloudIdSourceNotAllowedError,
  CloudIdSourceExpiredError,
  CloudIdSourceInvalidError,
}
