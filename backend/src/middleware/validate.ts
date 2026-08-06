import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { sendError } from '@utils/apiResponse';

interface ValidationSchemas {
  body?: ZodObject;
  query?: ZodObject;
  params?: ZodObject;
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query) as typeof req.query;
      if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return sendError(res, 'Validation failed', 422, err.flatten().fieldErrors);
      }
      next(err);
    }
  };
}