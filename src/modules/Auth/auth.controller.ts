import { Request, Response } from 'express';
import type { AuthService } from '.';
import { ControllerMethod } from '@dto';

export interface IAuthController {
  register: ControllerMethod;
  login: ControllerMethod;
}

export class AuthController implements IAuthController {
  constructor(private authService: AuthService) {}

  public async register(req: Request, res: Response) {
    const data = req.body;
    const token = await this.authService.register(data);
    res.status(201).send({ data: { token }, message: 'Registration success' });
  }

  public async login(req: Request, res: Response) {
    const { telegramId, password } = req.body;
    const token = await this.authService.login(telegramId, password);
    res.status(200).send({ data: { token }, message: 'Logged in' });
  }
}
