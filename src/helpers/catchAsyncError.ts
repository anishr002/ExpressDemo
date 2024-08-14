import { Request, Response, NextFunction } from 'express';

type AsyncErrorFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

const asyncErrorHandler = (theAsyncErrorFunction: AsyncErrorFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    theAsyncErrorFunction(req, res, next).catch(next);
  };
};

export default asyncErrorHandler;
