// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/user.model';

// We no longer import from 'env.config.ts'

interface JwtPayload {
  id: number;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: User;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  // FIX: Add a runtime check for the JWT secret.
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    res.status(500).json({ message: 'Internal server configuration error.' });
    return;
  }

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth Middleware: Token received:', token ? token.substring(0, 20) + '...' : 'No token');
      
      // This is now type-safe because of the check above.
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      console.log('Auth Middleware: Token decoded successfully:', { id: decoded.id, role: decoded.role });
      
      const currentUser = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
      console.log('Auth Middleware: User found:', currentUser ? { id: currentUser.id, role: currentUser.role } : 'No user found');

      if (!currentUser) {
        console.log('Auth Middleware: User not found in database');
        res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
        return;
      }

      req.user = currentUser;
      console.log('Auth Middleware: User set in request:', { id: req.user.id, role: req.user.role });
      next();
      return;

    } catch (error) {
      console.error('Auth Middleware: Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    console.log('Auth Middleware: No token provided');
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: 'You do not have permission to perform this action',
      });
      return;
    }
    next();
  };
};