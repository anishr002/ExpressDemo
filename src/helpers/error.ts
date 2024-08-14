import { Request, Response, NextFunction } from 'express';
import ErrorHandler from './errorHandler';
import logger from '../logger';

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal server error';

  // Wrong MongoDB Id Error
  if (err.name === 'CastError') {
    const message = 'Resource not found.';
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue).join(', ')} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT Error
  if (err.name === 'JsonWebTokenError') {
    const message = 'JsonWebToken is invalid, try again!';
    err = new ErrorHandler(message, 401);
  }

  // JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    const message = 'Session expired, please login again!';
    err = new ErrorHandler(message, 401);
  }

  logger.error(
    ` 
    /*****************Start*********************
        Date -> ${new Date().toDateString()},
        Time -> ${new Date().toLocaleTimeString()}
    
        ${err.stack}
        
    *******************End*******************/
  `,
  );

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    status: err.statusCode,
  });
};

export default errorMiddleware;
