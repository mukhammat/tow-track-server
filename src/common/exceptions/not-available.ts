import { HttpException } from '.';

interface NotAvailableOpts {
  entity?: string;
  id?: number | string;
  message?: string;
}

export class NotAvailableException extends HttpException {
  constructor(message = 'Not available') {
    super(403, message);
  }
}
