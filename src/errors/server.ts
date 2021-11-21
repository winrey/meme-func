import { CustomError } from './basic';

export class ServerInternalError extends CustomError {
  code = 60000;
  msg = 'Server Internal Error';
}

export class NetworkError extends CustomError {
  code = 60100;
  msg = 'Network Error';
}

export class UploadFileError extends CustomError {
  code = 60200;
  msg = 'Upload File Error';
  statusCode?: number;

  constructor(statusCode?: number) {
    super();
    this.statusCode = statusCode;
  }
}
