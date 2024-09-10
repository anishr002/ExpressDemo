import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { throwError } from '../helpers/errorUtils';
import { returnMessage } from '../utils/utils';
import User from '../models/User';
import { IUser } from '../types'; // Assuming you have a IUser interface

// Extend Express Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Middleware to protect routes
const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from headers (authorization or token)
    let token = req.headers.authorization || req.headers.token;

    if (token) {
      // If token is in the form of "Bearer <token>", split it
      token = (token as string).split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };

      // Find user by ID, exclude deleted users
      const user = await User.findById(decoded.id)
        .where('is_deleted')
        .equals(false)
        .select('-password'); // Exclude password field

      if (!user) {
        return next(throwError(returnMessage('auth', 'unAuthorized'), 401)); // Pass error to next()
      }

      // Attach user to request object
      req.user = user;
      next(); // Proceed to the next middleware or route handler
    } else {
      return next(throwError(returnMessage('auth', 'unAuthorized'), 401)); // Pass error to next()
    }
  } catch (error) {
    return next(throwError(returnMessage('auth', 'unAuthorized'), 401)); // Pass error to next()
  }
};

export default protect;
