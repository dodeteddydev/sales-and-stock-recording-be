import { NextFunction, Request, Response } from "express";
import {
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from "../models/authModel";
import {
  loginService,
  refreshTokenService,
  registerService,
} from "../services/authService";

const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as RegisterRequest;
    const response = await registerService(request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as LoginRequest;
    const response = await loginService(request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as RefreshTokenRequest;
    const response = await refreshTokenService(request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

export { registerController, loginController, refreshTokenController };
