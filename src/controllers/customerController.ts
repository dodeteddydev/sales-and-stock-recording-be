import { NextFunction, Response } from "express";
import { AuthRequest } from "../models/authModel";
import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "../models/customerModel";
import {
  createCustomerService,
  deleteCustomerService,
  updateCustomerService,
} from "../services/customerService";

const createCustomerController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as CreateCustomerRequest;
    const response = await createCustomerService(req.userId ?? 0, request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

const updateCustomerController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as UpdateCustomerRequest;
    const customerId = Number(req.params.id);
    const response = await updateCustomerService(
      req.userId ?? 0,
      customerId ?? 0,
      request,
      res,
    );

    return response;
  } catch (error) {
    next(error);
  }
};

const deleteCustomerController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = Number(req.params.id);
    const response = await deleteCustomerService(
      req.userId ?? 0,
      customerId ?? 0,
      res,
    );

    return response;
  } catch (error) {
    next(error);
  }
};

export {
  createCustomerController,
  updateCustomerController,
  deleteCustomerController,
};
