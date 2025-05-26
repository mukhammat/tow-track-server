import { Router } from 'express';
import { validate, asyncWrapper } from '@middleware';
import { IChatController } from '.';
import { ParamsSchemas } from '@dto';

interface IChatRouter {
  readonly router: Router;
}

export class ChatRouter implements IChatRouter {
  public readonly router: Router;
  constructor(private orderController: IChatController) {
    this.router = Router();
    this.routers();
  }

  private bindAsyncHandler(str: keyof IChatController) {
    return asyncWrapper(this.orderController[str].bind(this.orderController));
  }

  private routers() {
    this.router
      .post('/send', this.bindAsyncHandler('sendMessage'))
      .get(
        '/all/:chatId',
        validate('params', ParamsSchemas.chatId),
        this.bindAsyncHandler('getMessages'),
      );
  }
}
