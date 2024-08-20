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
  async (req: Request, res: Response, next: NextFunction) => {
    // Ensure req.body.skills is an array of numbers
    let { skills, ...otherData } = req.body;

    // Check if skills is a string (e.g., JSON string) and try to parse it
    if (typeof skills === 'string') {
      try {
        skills = JSON.parse(skills);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return next(
          new ErrorHandler(
            'Invalid format for skills, could not parse JSON',
            400,
          ),
        );
      }
    }

    // Ensure skills is an array before proceeding
    if (!Array.isArray(skills)) {
      return next(
        new ErrorHandler('Skills should be an array of numbers', 400),
      );
    }

    // Convert and validate skills array
    skills = skills.map((skill) => Number(skill)); // Convert to numbers

    if (
      !skills.every(
        (skill: number) => typeof skill === 'number' && !isNaN(skill),
      )
    ) {
      return next(
        new ErrorHandler('All elements in skills should be numbers', 400),
      );
    }

    // Pass validated data to the service
    const users = await authService.Addusers(otherData, skills, req.files);
    if (typeof users === 'string') return next(new ErrorHandler(users, 400));
    sendResponse(res, true, 'userCreated', users, 200);
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
