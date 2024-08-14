import express, { NextFunction, Request, Response } from 'express';
import connectDB from './config/db';
import CustomError from './utils/CustomError';
import rootRouter from './router';
import ErrorHandler from '../src/helpers/error';
require('dotenv').config();
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

app.use(
  '*',
  cors({
    origin: true,
    credentials: true, // Allow cookies to be sent and received
  }),
);
// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//implement morgan
app.use(morgan('dev'));
// Routes
app.use('/api', rootRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//default Route must be at last of all routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404,
  );
  next(err);
});

//Global error Handling middleware
app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
