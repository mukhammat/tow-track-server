export class HttpException extends Error {
  status: number;
  message: string;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
