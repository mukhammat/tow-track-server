import { HttpException } from './http';

export class NotFoundException extends HttpException {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}
