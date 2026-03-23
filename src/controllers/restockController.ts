import { NextFunction, Response } from "express";
import { AuthRequest } from "../models/authModel";
import { RestockRequest } from "../models/restockModel";
import {
  createRestockService,
  getRestockService,
  updateRestockService,
} from "../services/restockService";
import { ParametersType } from "../types/parametersType";

const createRestockController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as RestockRequest;
    const response = await createRestockService(req.userId ?? 0, request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

const getRestockController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
    } as ParametersType;

    const response = await getRestockService(req.userId ?? 0, request, res);

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
    const request = req.body as RestockRequest;
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

export {
  createRestockController,
  getRestockController,
  updateRestockController,
};
