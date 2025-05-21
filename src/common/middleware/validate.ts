import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

type ZodRequestParts = 'body' | 'query' | 'params';

export function validate<T extends z.ZodType>(part: ZodRequestParts = 'body', schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.validatedData = schema.parse(req[part]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        res.status(400).json({ error: 'Invalid data', details: errorMessages });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
}
