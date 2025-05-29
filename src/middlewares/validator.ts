import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

const validateRequest = (schema: ZodType) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({ status: false, message: error.errors?.[0]?.message || 'Invalid request' });
  }
};

export default validateRequest;
