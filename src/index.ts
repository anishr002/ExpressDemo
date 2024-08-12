import express, { NextFunction, Request, Response } from 'express';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import { globalErrorHandler } from './utils/globalErrorHandler';
import CustomError from './utils/CustomError';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api', userRoutes);

//default Route must be at last of all routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404,
  );
  next(err);
});

//Global error Handling middleware
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
