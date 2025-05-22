import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const UUIDSchema = z.string().uuid('ID заказа должен быть положительным числом');

export type Context = {
  req: Request;
  res: Response;
  next?: NextFunction;
};

export type ControllerMethod = (req: Request, res: Response) => Promise<void>;