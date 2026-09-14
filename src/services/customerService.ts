import { Response } from "express";
import { prisma } from "../config/db";
import { CustomerRequest, CustomerResponse } from "../models/customerModel";
import { createCustomerSchema } from "../schemas/customerSchema";
import { errorResponse, successResponse } from "../utils/response";
import { validation } from "../utils/validation";
import { checkUser } from "./authService";
import { ParametersType } from "../types/parametersType";
import { PaginationType } from "../types/paginationType";

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
  req: CustomerRequest,
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

  return successResponse<CustomerResponse>(
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

const getCustomerService = async (req: ParametersType, res: Response) => {
  const page = req.page || 1;
  const limit = req.limit || 10;
  const search = req.search ?? "";

  const skip = (page - 1) * limit;

  const where = {
    name: {
      contains: search,
    },
  };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip,
      include: {
        user: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return successResponse<PaginationType<CustomerResponse>>(
    res,
    "Customers fetched successfully",
    {
      data: customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        createdAt: customer.createdAt,
        createdBy: {
          id: customer.user.id,
          name: customer.user.name,
        },
      })),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
    200,
  );
};

const updateCustomerService = async (
  userId: number,
  customerId: number,
  req: CustomerRequest,
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

  return successResponse<CustomerResponse>(
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
  checkCustomerById,
  createCustomerService,
  getCustomerService,
  deleteCustomerService,
  updateCustomerService,
};
