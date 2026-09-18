import { Response } from "express";
import { prisma } from "../config/db";
import { RestockRequest, RestockResponse } from "../models/restockModel";
import {
  createRestockSchema,
  updateRestockSchema,
} from "../schemas/restockSchema";
import { PaginationType } from "../types/paginationType";
import { ParametersType } from "../types/parametersType";
import { errorResponse, successResponse } from "../utils/response";
import { validation } from "../utils/validation";
import { checkProductById, checkUser } from "./productService";

const checkRestockById = async (restockId: number) => {
  const restock = await prisma.restock.findUnique({
    where: {
      id: restockId,
    },
  });

  return restock;
};

const createRestockService = async (
  userId: number,
  req: RestockRequest,
  res: Response,
) => {
  const createRestockRequest = validation(createRestockSchema, req);

  await checkUser(userId, res);

  const product = await checkProductById(createRestockRequest.productId);

  if (!product) {
    return errorResponse(res, "Product not found", null, 404);
  }

  const restock = await prisma.restock.create({
    data: {
      productId: createRestockRequest.productId,
      qty: createRestockRequest.qty,
      costPrice: product.basePrice * createRestockRequest.qty,
      createdById: userId,
      cashflow: {
        create: {
          type: "OUT",
          category: "RESTOCK",
          amount: product.basePrice * createRestockRequest.qty,
          note: `Restock ${product.name}`,
          createdById: userId,
        },
      },
    },
    include: {
      product: true,
      createdBy: true,
    },
  });

  await prisma.product.update({
    where: {
      id: createRestockRequest.productId,
    },
    data: {
      stock: {
        increment: createRestockRequest.qty,
      },
    },
  });

  return successResponse<RestockResponse>(
    res,
    "Restock created successfully",
    {
      id: restock.id,
      qty: restock.qty,
      costPrice: restock.costPrice,
      product: {
        id: restock.product.id,
        name: restock.product.name,
      },
      createdAt: restock.createdAt,
      updatedAt: restock.updatedAt,
      createdBy: {
        id: restock.createdBy.id,
        name: restock.createdBy.name,
      },
      updatedBy: null,
    },
    200,
  );
};

const getRestockService = async (
  userId: number,
  req: ParametersType,
  res: Response,
) => {
  await checkUser(userId, res);

  const page = req.page || 1;
  const limit = req.limit || 10;

  const skip = (page - 1) * limit;

  const where = {
    createdById: userId,
  };

  const [restocks, total] = await Promise.all([
    prisma.restock.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit,
      skip,
      include: {
        createdBy: true,
        updatedBy: true,
        product: true,
      },
    }),
    prisma.restock.count({ where }),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return successResponse<PaginationType<RestockResponse>>(
    res,
    "Restocks fetched successfully",
    {
      data: restocks.map((restock) => ({
        id: restock.id,
        qty: restock.qty,
        costPrice: restock.costPrice,
        product: {
          id: restock.product.id,
          name: restock.product.name,
        },
        createdAt: restock.createdAt,
        updatedAt: restock.updatedAt,
        createdBy: {
          id: restock.createdBy.id,
          name: restock.createdBy.name,
        },
        updatedBy: restock.updatedBy
          ? {
              id: restock.updatedBy.id,
              name: restock.updatedBy.name,
            }
          : null,
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

const updateRestockService = async (
  userId: number,
  restockId: number,
  req: RestockRequest,
  res: Response,
) => {
  const updateRestockRequest = validation(updateRestockSchema, req);

  await checkUser(userId, res);

  const restockExist = await checkRestockById(restockId);

  if (!restockExist) {
    return errorResponse(res, "Restock not found", null, 404);
  }

  const product = await checkProductById(restockExist.productId);

  if (!product) {
    return errorResponse(res, "Product not found", null, 404);
  }

  const restock = await prisma.restock.update({
    where: {
      id: restockId,
    },
    data: {
      qty: updateRestockRequest.qty,
      costPrice: product.basePrice * updateRestockRequest.qty,
      updatedById: userId,
      cashflow: {
        update: {
          type: "OUT",
          category: "RESTOCK",
          amount: product.basePrice * updateRestockRequest.qty,
          note: `Restock ${product.name}`,
          updatedById: userId,
        },
      },
    },
    include: {
      product: true,
      createdBy: true,
      updatedBy: true,
    },
  });

  await prisma.product.update({
    where: {
      id: restockExist.productId,
    },
    data: {
      stock: {
        increment: updateRestockRequest.qty - restockExist.qty,
      },
    },
  });

  return successResponse<RestockResponse>(
    res,
    "Restock updated successfully",
    {
      id: restock.id,
      qty: restock.qty,
      costPrice: restock.costPrice,
      product: {
        id: restock.product.id,
        name: restock.product.name,
      },
      createdAt: restock.createdAt,
      updatedAt: restock.updatedAt,
      createdBy: {
        id: restock.createdBy.id,
        name: restock.createdBy.name,
      },
      updatedBy: restock.updatedBy
        ? {
            id: restock.updatedBy.id,
            name: restock.updatedBy.name,
          }
        : null,
    },
    200,
  );
};

export { createRestockService, getRestockService, updateRestockService };
