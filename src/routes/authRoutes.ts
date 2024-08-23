import express from 'express';
import {
  forgotPassword,
  loginUser,
  resetPassword,
} from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/login', loginUser);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.patch('/resetPassword/:token', resetPassword);

export default authRouter;
