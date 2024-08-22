import { NextFunction, Request, Response } from 'express';
import asyncErrorHandler from '../helpers/catchAsyncError';
import AuthService from '../services/authService';
import ErrorHandler from '../helpers/errorHandler';
import sendResponse from '../utils/sendResponse';

const authService = new AuthService();

export const loginUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler('Email and password are required', 400));
    }

    const result = await authService.LoginUser(email, password);
    if (typeof result === 'string') return next(new ErrorHandler(result, 400));

    const { user, token } = result;
    sendResponse(res, true, 'loginSuccess', { user, token }, 200);
  },
);
