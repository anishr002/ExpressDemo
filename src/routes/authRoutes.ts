import express from 'express';
import {
  forgotPassword,
  loginUser,
  resetPassword,
  SocialLoginUser,
} from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/login', loginUser);
authRouter.post('/sociaLogin', SocialLoginUser);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.patch('/resetPassword/:token', resetPassword);

export default authRouter;
