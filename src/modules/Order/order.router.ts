import { Router } from 'express';
import { validate, asyncWrapper } from '@middleware';
import { CreateOrderSchema, IOrderController } from '.';
import { UUIDSchema } from '@dto';

interface IOrderRouter {
  readonly router: Router;
}

export class OrderRouter implements IOrderRouter {
  public readonly router: Router;
  constructor(private orderController: IOrderController) {
    this.router = Router();
    this.routers();
  }

  private bindAsyncHandler(str: keyof IOrderController) {
    return asyncWrapper(this.orderController[str].bind(this.orderController));
  }

  private routers() {
    this.router
      .post('/create', validate('body', CreateOrderSchema), this.bindAsyncHandler('createOrder'))
      .get('/all', this.bindAsyncHandler('getAll'))
      .patch(
        '/cancel/:orderId',
        validate('params', UUIDSchema),
        this.bindAsyncHandler('cancelOrder'),
      )
      .patch(
        '/complete/:orderId',
        validate('params', UUIDSchema),
        this.bindAsyncHandler('completeOrder'),
      )
      .get('/get/:orderId', validate('params', UUIDSchema), this.bindAsyncHandler('getById'));
  }
}
