import { NextFunction, Response } from "express";
import { AuthRequest } from "../models/authModel";
import { ProductRequest } from "../models/productModel";
import {
  createProductService,
  deleteProductService,
  getProductService,
  updateProductService,
} from "../services/productService";
import { ParametersType } from "../types/parametersType";

const createProductController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as ProductRequest;
    const response = await createProductService(req.userId ?? 0, request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

const getProductController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = {
      search: req.query.search,
      page: Number(req.query.page),
      limit: Number(req.query.limit),
    } as ParametersType;

    const response = await getProductService(req.userId ?? 0, request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

const updateProductController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as ProductRequest;
    const productId = Number(req.params.id);
    const response = await updateProductService(
      req.userId ?? 0,
      productId ?? 0,
      request,
      res,
    );

    return response;
  } catch (error) {
    next(error);
  }
};

const deleteProductController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = Number(req.params.id);
    const response = await deleteProductService(
      req.userId ?? 0,
      productId,
      res,
    );

    return response;
  } catch (error) {
    next(error);
  }
};

export {
  createProductController,
  getProductController,
  deleteProductController,
  updateProductController,
};
