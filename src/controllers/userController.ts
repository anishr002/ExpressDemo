import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import CustomError from '../utils/CustomError';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;

  try {
    let user = new User({ name, email, password });
    await user.save();
    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const err = new CustomError(error.message, 400);
      next(err);
    } else {
      next(new CustomError('An unexpected error occurred', 500));
    }
  }
};
