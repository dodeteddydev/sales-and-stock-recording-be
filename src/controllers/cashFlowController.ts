import { NextFunction, Response } from "express";
import { AuthRequest } from "../models/authModel";
import { CreateCashFlowRequest } from "../models/cashFlowModel";
import {
  createCashFlowService,
  updateCashFlowService,
} from "../services/cashFlowService";

const createCashFlowController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as CreateCashFlowRequest;
    const response = await createCashFlowService(req.userId ?? 0, request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

const updateCashFlowController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as CreateCashFlowRequest;
    const cashFlowId = Number(req.params.id);

    const response = await updateCashFlowService(
      req.userId ?? 0,
      cashFlowId ?? 0,
      request,
      res,
    );

    return response;
  } catch (error) {
    next(error);
  }
};

export { createCashFlowController, updateCashFlowController };
