import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { throwError } from '../helpers/errorUtils';
import { returnMessage } from '../utils/utils';
import User from '../models/User';
import { IUser } from '../types'; // Assuming you have an interface for User

//add users interface into a requset
declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Extend the Request interface to include a user property
    }
  }
}
// Define the middleware function type
type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const protect: AsyncHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.headers.token;

    if (token) {
      const Authorization = (token as string).split(' ')[1];
      const decodedUserData = jwt.verify(
        Authorization,
        process.env.JWT_User_SECRET_KEY!,
      ) as { id: string };

      const user = await User.findById(decodedUserData.id)
        .where('is_deleted')
        .equals('false')
        .select('-password')
        .lean<IUser>();

      if (!user) {
        return throwError(returnMessage('auth', 'unAuthorized'), 401);
      }

      req.user = user;
      next();
    } else {
      return throwError(returnMessage('auth', 'unAuthorized'), 401);
    }
  } catch (error) {
    return throwError(returnMessage('auth', 'unAuthorized'), 401);
  }
};
