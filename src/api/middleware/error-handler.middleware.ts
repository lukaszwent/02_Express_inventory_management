import { Request, Response, NextFunction } from "express";
import { AppError } from "../../domain/exceptions/app-errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", {
    name: err.name,
    message: err.message,
    path: req.path,
    method: req.method,
  });

  // Handle known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Handle unexpected errors
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
