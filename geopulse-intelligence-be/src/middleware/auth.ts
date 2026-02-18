/* eslint-disable @typescript-eslint/no-namespace */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../app/modules/Auth/auth.interface';
import { User } from '../app/modules/Auth/auth.model';
import config from '../config';
import { ApplicationError } from '../errors/ApplicationError';
import logger from '../utils/logger';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApplicationError(httpStatus.UNAUTHORIZED, 'No token provided');
      }

      const token = authHeader.split(' ')[1];

      // Verify token
      let decoded: IJwtPayload;
      try {
        decoded = jwt.verify(token, config.jwt.jwt_secret) as IJwtPayload;
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          throw new ApplicationError(httpStatus.UNAUTHORIZED, 'Token has expired');
        }
        throw new ApplicationError(httpStatus.UNAUTHORIZED, 'Invalid token');
      }

      // Check if user exists and is active
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new ApplicationError(httpStatus.UNAUTHORIZED, 'User not found');
      }

      if (!user.isActive) {
        throw new ApplicationError(httpStatus.FORBIDDEN, 'Account is deactivated');
      }

      // Check role authorization
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        throw new ApplicationError(
          httpStatus.FORBIDDEN,
          'You do not have permission to perform this action',
        );
      }

      // Attach user to request
      req.user = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      logger.error('Authentication error:', error);
      next(error);
    }
  };
};

// Optional auth - doesn't throw error if no token
export const optionalAuth = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
      }

      const token = authHeader.split(' ')[1];

      try {
        const decoded = jwt.verify(token, config.jwt.jwt_secret) as IJwtPayload;

        const user = await User.findById(decoded.userId);

        if (user && user.isActive) {
          req.user = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
          };
        }
      } catch (error) {
        logger.debug('Optional auth failed:', error);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
