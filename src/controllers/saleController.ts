import { NextFunction, Response } from "express";
import { AuthRequest } from "../models/authModel";
import { CreateSaleRequest } from "../models/saleModel";
import { createSaleService, updateSaleService } from "../services/saleService";

const createSaleController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as CreateSaleRequest;
    const response = await createSaleService(req.userId ?? 0, request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

const updateSaleController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as CreateSaleRequest;
    const saleId = Number(req.params.id);

    const response = await updateSaleService(
      req.userId ?? 0,
      saleId ?? 0,
      request,
      res,
    );

    return response;
  } catch (error) {
    next(error);
  }
};

export { createSaleController, updateSaleController };
