import { NextFunction, Response } from "express";
import { AuthRequest } from "../models/authModel";
import { CreateRestockRequest } from "../models/restockModel";
import {
  createRestockService,
  updateRestockService,
} from "../services/restockService";

const createRestockController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as CreateRestockRequest;
    const response = await createRestockService(req.userId ?? 0, request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

const updateRestockController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as CreateRestockRequest;
    const restockId = Number(req.params.id);
    const response = await updateRestockService(
      req.userId ?? 0,
      restockId ?? 0,
      request,
      res,
    );

    return response;
  } catch (error) {
    next(error);
  }
};

export { createRestockController, updateRestockController };
