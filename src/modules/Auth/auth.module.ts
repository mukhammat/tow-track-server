import { DrizzleClient } from '@database';
import { AuthController, AuthRouter, AuthService } from '.';

export const createAuth = (db: DrizzleClient) => {
  const service = new AuthService(db);
  const controller = new AuthController(service);
  return new AuthRouter(controller).router;
};
