import { NextFunction, Request, Response } from 'express';
// import User from '../models/User';
// import CustomError from '../utils/CustomError';
import asyncErrorHandler from '../helpers/catchAsyncError';
import AuthService from '../services/authService';
import ErrorHandler from '../helpers/errorHandler';
import sendResponse from '../utils/sendResponse';

const authService = new AuthService();

export const getAllUsers = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await authService.Getallusers();
    if (typeof users === 'string') return next(new ErrorHandler(users, 400));
    sendResponse(res, true, 'userUpdated', users, 200);
  },
);

export const createUser = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { skills, ...otherData } = req.body;

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

    if (!Array.isArray(skills)) {
      return next(
        new ErrorHandler('Skills should be an array of numbers', 400),
      );
    }

    skills = skills.map((skill) => Number(skill));

    if (
      !skills.every(
        (skill: number) => typeof skill === 'number' && !isNaN(skill),
      )
    ) {
      return next(
        new ErrorHandler('All elements in skills should be numbers', 400),
      );
    }

    const result = await authService.Addusers(otherData, skills, req.files);
    if (typeof result === 'string') return next(new ErrorHandler(result, 400));

    const { user, token } = result;
    sendResponse(res, true, 'userCreated', { user, token }, 200);
  },
);

export const createUserbySocial = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { skills, ...otherData } = req.body;

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

    if (!Array.isArray(skills)) {
      return next(
        new ErrorHandler('Skills should be an array of numbers', 400),
      );
    }

    skills = skills.map((skill) => Number(skill));

    if (
      !skills.every(
        (skill: number) => typeof skill === 'number' && !isNaN(skill),
      )
    ) {
      return next(
        new ErrorHandler('All elements in skills should be numbers', 400),
      );
    }

    const result = await authService.AddSocialusers(
      otherData,
      skills,
      req.files,
    );
    if (typeof result === 'string') return next(new ErrorHandler(result, 400));

    const { user, token } = result;
    sendResponse(res, true, 'userCreated', { user, token }, 200);
  },
);
