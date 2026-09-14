import { NextFunction, Response } from "express";
import { AuthRequest } from "../models/authModel";
import { CustomerRequest } from "../models/customerModel";
import {
  createCustomerService,
  deleteCustomerService,
  getCustomerService,
  updateCustomerService,
} from "../services/customerService";
import { ParametersType } from "../types/parametersType";

const createCustomerController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body as CustomerRequest;
    const response = await createCustomerService(req.userId ?? 0, request, res);

    return response;
  } catch (error) {
    next(error);
  }
};

const getCustomerController = async (
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

    const response = await getCustomerService(request, res);

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
    const request = req.body as CustomerRequest;
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
  deleteCustomerController,
  getCustomerController,
  updateCustomerController,
};
