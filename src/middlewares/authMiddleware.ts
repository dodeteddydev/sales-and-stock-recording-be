import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "../models/authModel";
import { errorResponse } from "../utils/response";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return errorResponse(res, "Unauthorized", "Invalid token", 401);
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string,
      ) as JwtPayload & { id?: number };

      if (!decoded || typeof decoded !== "object" || !decoded.id) {
        return errorResponse(res, "Unauthorized", "Invalid token", 401);
      }

      req.userId = decoded.id;

      next();
    } catch {
      return errorResponse(res, "Unauthorized", "Invalid token", 401);
    }
  } else {
    return errorResponse(res, "Unauthorized", "Invalid token", 401);
  }
};
