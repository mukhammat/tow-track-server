import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const UUIDSchema = z.string().uuid('Некорректный UUID');

export const createUUIDSchema = (param: string) => {
  return z.object({ [param]: UUIDSchema })
}

export const ParamsSchemas = {
  orderId: createUUIDSchema("orderId"),
  offerId: createUUIDSchema("offerId"),
  chatId: createUUIDSchema("chatId"),
} as const;

export type Context = {
  req: Request;
  res: Response;
  next?: NextFunction;
};

export type ControllerMethod<TReq = Request, TRes = Response> = (
  req: TReq,
  res: TRes,
) => Promise<void>;