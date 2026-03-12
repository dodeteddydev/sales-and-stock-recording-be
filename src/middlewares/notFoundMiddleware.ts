import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return errorResponse(
    res,
    "Not Found",
    "The requested endpoint does not exist",
    404,
  );
};
