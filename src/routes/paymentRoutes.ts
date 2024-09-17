import express from 'express';
import { capturePaymen, createOrder } from '../controllers/paymentController';

const paymentRouter = express.Router();

paymentRouter.get('/getpaypaltoken', createOrder);
paymentRouter.get('/getpaymentdetails/:id', capturePaymen);

export default paymentRouter;
