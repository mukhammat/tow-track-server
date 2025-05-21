import { Request, Response } from 'express';
import type { AuthService } from '.';

export interface IAuthController {
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
}

export class AuthController implements IAuthController {
  constructor(private authService: AuthService) {}

  public async register(req: Request, res: Response) {
    const data = req.body;
    const token = await this.authService.register(data);
    res.status(201).send({ data: { token }, message: 'Registration success' });
  }

  public async login(req: Request, res: Response) {
    const { telegram_id, password } = req.body;
    const token = await this.authService.login(telegram_id, password);
    res.status(200).send({ data: { token }, message: 'Logged in' });
  }
}
