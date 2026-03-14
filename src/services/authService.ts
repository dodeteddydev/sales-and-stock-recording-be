import bcrypt from "bcrypt";
import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config/db";
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from "../models/authModel";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../schemas/authSchema";
import { generateRefreshToken, generateToken } from "../utils/generateToken";
import { errorResponse, successResponse } from "../utils/response";
import { validation } from "../utils/validation";

const checkUser = async (userId: number, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return errorResponse(res, "Unauthorized", "Invalid token", 401);
  }
};

const registerService = async (req: RegisterRequest, res: Response) => {
  const registerRequest = validation(registerSchema, req);

  const userExist = await prisma.user.findUnique({
    where: {
      username: registerRequest.username,
    },
  });

  if (userExist) {
    return errorResponse(res, "User already exist", null, 409);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(registerRequest.password, salt);

  const user = await prisma.user.create({
    data: {
      username: registerRequest.username,
      password: hashedPassword,
      role: registerRequest.role,
    },
  });

  return successResponse<RegisterResponse>(
    res,
    "User registered successfully",
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    201,
  );
};

const loginService = async (req: LoginRequest, res: Response) => {
  const loginRequest = validation(loginSchema, req);

  const user = await prisma.user.findUnique({
    where: {
      username: loginRequest.username,
    },
  });

  if (!user) {
    return errorResponse(res, "Invalid username or password", null, 404);
  }

  const isValidPassword = await bcrypt.compare(
    loginRequest.password,
    user?.password ?? "",
  );

  if (!isValidPassword) {
    return errorResponse(res, "Invalid username or password", null, 404);
  }

  const token = generateToken(user?.id ?? 0);
  const refreshToken = generateRefreshToken(user?.id ?? 0, res);

  return successResponse<LoginResponse>(
    res,
    "User logged in successfully",
    {
      id: user.id,
      username: user.username,
      role: user.role,
      token,
      refreshToken,
    },
    200,
  );
};

const refreshTokenService = async (req: RefreshTokenRequest, res: Response) => {
  const refreshTokenRequest = validation(refreshTokenSchema, req);

  const decoded = jwt.verify(
    refreshTokenRequest.refreshToken,
    process.env.JWT_REFRESH_SECRET as string,
  ) as JwtPayload & { id?: number };

  if (!decoded || typeof decoded !== "object" || !decoded.id) {
    return errorResponse(res, "Unauthorized", "Invalid token", 401);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    return errorResponse(res, "Unauthorized", "Invalid token", 401);
  }

  const token = generateToken(decoded.id ?? 0);
  const refreshToken = generateRefreshToken(decoded.id ?? 0, res);

  return successResponse<RefreshTokenResponse>(
    res,
    "Token refreshed successfully",
    {
      token,
      refreshToken,
    },
    200,
  );
};

export { checkUser, loginService, refreshTokenService, registerService };
