import { Document, ObjectId } from 'mongoose';

// Define types for User model
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Define types for other models (if any)
// Example: for a Post model
export interface IPost extends Document {
  title: string;
  content: string;
  author: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Utility type for error handling
export interface ErrorWithMessage extends Error {
  message: string;
  statusCode?: number; // Make this optional if not all errors have a status code
  status?: string;  
  isOperational?: boolean;
}
