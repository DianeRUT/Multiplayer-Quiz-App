// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => { // Explicitly add return type for clarity
    console.log('Validation middleware called for:', req.path);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      console.log('Validation passed');
      // Validation passed, proceed to the next middleware/controller
      next();
    } catch (error) {
      console.log('Validation failed');
      // Validation failed.
      if (error instanceof ZodError) {
        console.log('Validation error details:', JSON.stringify(error.errors, null, 2));
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        // Send a structured error response
        res.status(400).json(error.errors);
      } else {
        // Handle other potential errors
        res.status(500).json({ message: 'Internal Server Error during validation' });
      }
      // IMPORTANT: We do not call next() here because the request is terminated.
      // IMPORTANT: We do NOT 'return' the response.
    }
  };