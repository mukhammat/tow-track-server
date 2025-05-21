import { HttpException } from './http';

export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request', details?: unknown) {
    super(400, message, details);
  }
}
