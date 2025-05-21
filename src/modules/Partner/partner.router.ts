import { Router } from 'express';
import { validate, asyncWrapper } from '@middleware';
import { IPartnerController } from '.';

interface IPartnerRouter {
  readonly router: Router;
}

export class PartnerRouter implements IPartnerRouter {
  public readonly router: Router;
  constructor(private partnerController: IPartnerController) {
    this.router = Router();
    this.routers();
  }

  private bindAsyncHandler(str: keyof IPartnerController) {
    return asyncWrapper(this.partnerController[str].bind(this.partnerController));
  }

  private routers() {
    this.router.post('/update-phone', this.bindAsyncHandler('updatePhone'));
  }
}
