import { Router } from 'express';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import productRouter from './routes/productRoutes';

const rootRouter = Router();

rootRouter.use('/users', userRouter);
rootRouter.use('/auth', authRouter);
rootRouter.use('/product', productRouter);

export default rootRouter;
