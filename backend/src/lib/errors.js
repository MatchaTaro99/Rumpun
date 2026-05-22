export class HttpError extends Error {
  constructor(statusCode, message, code = 'http_error') {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function isHttpError(error) {
  return error instanceof HttpError;
}

