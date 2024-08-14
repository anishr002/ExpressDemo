import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import CustomError from '../utils/CustomError';
import asyncErrorHandler from '../helpers/catchAsyncError';
import AuthService from '../services/authService';
import ErrorHandler from '../helpers/errorHandler';
import sendResponse from '../utils/sendResponse';

const authService = new AuthService();

export const getAllUsers = asyncErrorHandler(
  async (req: Request, res: Response, next: any) => {
    const users = await authService.Getallusers();
    if (typeof users === 'string') return next(new ErrorHandler(users, 400));
    sendResponse(res, true, 'userUpdated', users, 200);
  },
);

export const createUser = asyncErrorHandler(
  async (req: Request, res: Response, next: any) => {
    const users = await authService.Addusers(req.body, req.file);
    if (typeof users === 'string') return next(new ErrorHandler(users, 400));
    console.log(users, 'user');
    sendResponse(res, true, 'userUpdated', users, 200);
  },
);

// export const createUser = asyncErrorHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { name, email, password } = req.body;

//     try {
//       let user = new User({ name, email, password });
//       await user.save();
//       res.json(user);
//     } catch (error: any) {
//       if (error.name === 'ValidationError') {
//         const err = new CustomError(error.message, 400);
//         next(err);
//       } else if (error.code === 11000) {
//         // Duplicate key error
//         const err = new CustomError('Email already exists', 400);
//         next(err);
//       } else {
//         const err = new CustomError('Internal server error', 500);
//         next(err);
//       }
//     }
//   },
// );
