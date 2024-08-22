import { Router } from 'express';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';

const rootRouter = Router();

rootRouter.use('/users', userRouter);
rootRouter.use('/auth', authRouter);

export default rootRouter;
