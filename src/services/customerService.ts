import { Response } from "express";
import { prisma } from "../config/db";
import {
  CreateCustomerRequest,
  CreateCustomerResponse,
  UpdateCustomerResponse,
} from "../models/customerModel";
import { createCustomerSchema } from "../schemas/customerSchema";
import { errorResponse, successResponse } from "../utils/response";
import { validation } from "../utils/validation";
import { checkUser } from "./authService";

const checkCustomerByPhone = async (phone: string) => {
  const customer = await prisma.customer.findUnique({
    where: {
      phone: phone,
    },
  });

  return customer;
};

const checkCustomerById = async (id: number) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: id,
    },
    include: {
      user: true,
      _count: {
        select: {
          sales: true,
        },
      },
    },
  });

  return customer;
};

const createCustomerService = async (
  userId: number,
  req: CreateCustomerRequest,
  res: Response,
) => {
  const createCustomerRequest = validation(createCustomerSchema, req);

  await checkUser(userId, res);

  const customerExistByPhone = await checkCustomerByPhone(
    createCustomerRequest.phone,
  );

  if (customerExistByPhone) {
    return errorResponse(
      res,
      "Phone number already used in another customer",
      null,
      409,
    );
  }

  const customer = await prisma.customer.create({
    data: {
      name: createCustomerRequest.name,
      phone: createCustomerRequest.phone,
      userId: userId,
    },
    include: {
      user: true,
    },
  });

  return successResponse<CreateCustomerResponse>(
    res,
    "Customer created successfully",
    {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      createdAt: customer.createdAt,
      createdBy: {
        id: customer.user.id,
        name: customer.user.name,
      },
    },
    201,
  );
};

const updateCustomerService = async (
  userId: number,
  customerId: number,
  req: CreateCustomerRequest,
  res: Response,
) => {
  const updateCustomerRequest = validation(createCustomerSchema, req);

  await checkUser(userId, res);

  const customerExist = await checkCustomerById(customerId);

  if (!customerExist) {
    return errorResponse(res, "Customer not found", null, 404);
  }

  if (customerExist.phone !== updateCustomerRequest.phone) {
    const customerExistByPhone = await checkCustomerByPhone(
      updateCustomerRequest.phone,
    );

    if (customerExistByPhone) {
      return errorResponse(
        res,
        "Phone number already used in another customer",
        null,
        409,
      );
    }
  }

  const customer = await prisma.customer.update({
    where: {
      id: customerId,
    },
    data: updateCustomerRequest,
    include: {
      user: true,
    },
  });

  return successResponse<UpdateCustomerResponse>(
    res,
    "Customer updated successfully",
    {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      createdAt: customer.createdAt,
      createdBy: {
        id: customer.user.id,
        name: customer.user.name,
      },
    },
    200,
  );
};

const deleteCustomerService = async (
  userId: number,
  customerId: number,
  res: Response,
) => {
  await checkUser(userId, res);

  const customer = await checkCustomerById(customerId);

  if (!customer) {
    return errorResponse(res, "Customer not found", null, 404);
  }

  if (customer._count.sales > 0) {
    return errorResponse(
      res,
      "Delete customer failed",
      "Customer already used in transactions",
      409,
    );
  }

  await prisma.customer.delete({
    where: {
      id: customerId,
    },
  });

  return successResponse(res, "Customer deleted successfully", null, 200);
};

export {
  createCustomerService,
  deleteCustomerService,
  updateCustomerService,
  checkCustomerById,
};
