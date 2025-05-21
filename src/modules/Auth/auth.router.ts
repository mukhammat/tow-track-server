import { Router } from 'express';
import { validate, asyncWrapper } from '@middleware';
import { LoginSchema, RegisterSchema, type IAuthController } from '.';

interface IAuthRouter {
  readonly router: Router;
}

export class AuthRouter implements IAuthRouter {
  public readonly router: Router;
  constructor(private authController: IAuthController) {
    this.router = Router();
    this.routers();
  }

  private bindAsyncHandler(str: keyof IAuthController) {
    return asyncWrapper(this.authController[str].bind(this.authController));
  }

  private routers() {
    this.router
      .post('/register', validate('body', RegisterSchema), this.bindAsyncHandler('register'))
      .post('/login', validate('body', LoginSchema), this.bindAsyncHandler('login'));
  }
}
