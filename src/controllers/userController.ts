import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    let user = new User({ name, email, password });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
