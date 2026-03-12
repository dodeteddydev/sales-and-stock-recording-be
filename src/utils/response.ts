import { Response } from "express";

const successResponse = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    errors: null,
  });
};

const errorResponse = <T>(
  res: Response,
  message: string,
  errors: T,
  statusCode = 500,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors,
  });
};

export { successResponse, errorResponse };
