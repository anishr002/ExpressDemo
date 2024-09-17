import { Router } from 'express';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import productRouter from './routes/productRoutes';
import categoryRouter from './routes/categoryRoutes';
import paymentRouter from './routes/paymentRoutes';

const rootRouter = Router();

rootRouter.use('/users', userRouter);
rootRouter.use('/auth', authRouter);
rootRouter.use('/product', productRouter);
rootRouter.use('/category', categoryRouter);
rootRouter.use('/payment', paymentRouter);

export default rootRouter;
