import { Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (userId: number) => {
  const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
  const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;

  const payload = {
    id: userId,
  };

  const token = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: `${Number(JWT_ACCESS_EXPIRES_IN)}m` || "15m",
  });

  return token;
};

const generateRefreshToken = (userId: number, res: Response) => {
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
  const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

  const payload = {
    id: userId,
  };

  const token = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: `${Number(JWT_REFRESH_EXPIRES_IN)}d` || "7d",
  });

  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: Number(JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000,
  });

  return token;
};

export { generateToken, generateRefreshToken };
