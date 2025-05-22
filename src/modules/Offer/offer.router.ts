import { Router } from 'express';
import { validate, asyncWrapper } from '@middleware';
import { CreateOfferSchema, IOfferController } from '.';
import { UUIDSchema } from '@dto';

interface IOfferRouter {
  readonly router: Router;
}

export class OfferRouter implements IOfferRouter {
  public readonly router: Router;
  constructor(private orderController: IOfferController) {
    this.router = Router();
    this.routers();
  }

  private bindAsyncHandler(str: keyof IOfferController) {
    return asyncWrapper(this.orderController[str].bind(this.orderController));
  }

  private routers() {
    this.router
      .patch(
        '/accept/:offerId',
        validate('params', UUIDSchema),
        this.bindAsyncHandler('acceptOfferThenOrder'),
      )
      .post('/create', validate('body', CreateOfferSchema), this.bindAsyncHandler('createOffer'))
      .get(
        '/all/:orderId',
        validate('params', UUIDSchema),
        this.bindAsyncHandler('getOffersByOrderId'),
      )
      .patch(
        '/cancel/:offerId',
        validate('params', UUIDSchema),
        this.bindAsyncHandler('cancelOffer'),
      );
  }
}
