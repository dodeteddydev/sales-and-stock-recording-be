import { NextFunction, Response } from "express";
import { AuthRequest } from "../models/authModel";
import { SaleParameters, SaleRequest } from "../models/saleModel";
import {
  createSaleService,
  getSaleService,
  updateSaleService,
} from "../services/saleService";

const createSaleController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as SaleRequest;
    const response = await createSaleService(req.userId ?? 0, request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

const getSaleController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      customerId: Number(req.query.customerId),
      productId: Number(req.query.productId),
    } as SaleParameters;

    const response = await getSaleService(req.userId ?? 0, request, res);

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
    const request = req.body as SaleRequest;
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

export { createSaleController, getSaleController, updateSaleController };
