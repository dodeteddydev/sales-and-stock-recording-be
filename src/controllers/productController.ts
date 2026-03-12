import { NextFunction, Request, Response } from "express";
import { CreateProductRequest } from "../models/productModel";
import { AuthRequest } from "../models/authModel";
import {
  createProductService,
  deleteProductService,
  updateProductService,
} from "../services/productService";

const createProductController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as CreateProductRequest;
    const response = await createProductService(req.userId ?? 0, request, res);

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
    const request = req.body as CreateProductRequest;
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
  updateProductController,
  deleteProductController,
};
