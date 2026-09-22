import { NextFunction, Response } from "express";
import { AuthRequest } from "../models/authModel";
import { CashFlowParameters, CashFlowRequest } from "../models/cashFlowModel";
import {
  createCashFlowService,
  getCashFlowService,
  updateCashFlowService,
} from "../services/cashFlowService";

const createCashFlowController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as CashFlowRequest;
    const response = await createCashFlowService(req.userId ?? 0, request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

const getCashFlowController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      type: req.query.type,
      category: req.query.category,
    } as CashFlowParameters;

    const response = await getCashFlowService(req.userId ?? 0, request, res);

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
    const request = req.body as CashFlowRequest;
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

export {
  createCashFlowController,
  getCashFlowController,
  updateCashFlowController,
};
