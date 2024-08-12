import { ErrorWithMessage } from "../types";

class CustomError extends Error implements ErrorWithMessage {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    // Initialize properties
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
