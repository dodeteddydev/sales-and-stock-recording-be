import { Request } from "express";
import { Role } from "../../generated/prisma/enums";

export interface AuthRequest extends Request {
  userId?: number;
}

export type RegisterRequest = {
  name: string;
  username: string;
  password: string;
  role: Role;
};

export type RegisterResponse = {
  id: number;
  name: string;
  username: string;
  role: Role;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = RegisterResponse & {
  token: string;
  refreshToken: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  token: string;
  refreshToken: string;
};
