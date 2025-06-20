import { Request, Response, NextFunction } from "express";
import { ApiError } from "../lib/apiError";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (err instanceof ApiError && err.statusCode) || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err instanceof ApiError ? err.errors : [],
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
