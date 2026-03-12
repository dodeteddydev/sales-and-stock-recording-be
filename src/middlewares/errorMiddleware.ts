import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { errorResponse } from "../utils/response";
import jwt from "jsonwebtoken";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    const zodError =
      err.issues.length > 1
        ? err.issues.map((issue) => issue.message)
        : err.issues[0].message;

    return errorResponse(res, "Validation error", zodError, 400);
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return errorResponse(res, "Unauthorized", "Invalid token", 401);
  }

  console.log(err.message);

  return errorResponse(res, "Internal server error", null, 500);
};
