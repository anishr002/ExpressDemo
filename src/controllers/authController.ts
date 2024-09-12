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
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }
    const { user, token } = result;
    sendResponse(res, true, 'loginSuccess', { user, token }, 200);
  },
);

export const SocialLoginUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorHandler('Email are required', 400));
    }

    const result = await authService.SocialLoginUser(email);
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }
    const { user, token } = result;
    sendResponse(res, true, 'loginSuccess', { user, token }, 200);
  },
);

export const forgotPassword = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      return next(new ErrorHandler('Email is required', 400));
    }

    const result = await authService.forgotPassword(email);
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }

    res.status(200).json(result);
  },
);

export const resetPassword = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return next(new ErrorHandler('Password is required', 400));
    }

    const result = await authService.resetPassword(token, password);
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }

    res.status(200).json(result);
  },
);
