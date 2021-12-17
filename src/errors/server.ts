import { ServerError } from 'adv-err';

export class UploadFileError extends ServerError {
  code = 6201;
  message = 'Upload File Error';
  statusCode?: number;

  constructor(statusCode?: number) {
    super();
    this.statusCode = statusCode;
  }
}
