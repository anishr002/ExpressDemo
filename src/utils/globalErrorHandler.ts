import { NextFunction, Request, Response } from "express";
import { ErrorWithMessage } from "../types";

export const globalErrorHandler = (
    error: ErrorWithMessage,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
  
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  };
  