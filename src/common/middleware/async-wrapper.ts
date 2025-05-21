import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncWrapper = (fn: AsyncHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
