import { Response } from "express";
import {
  CreateRestockRequest,
  CreateRestockResponse,
  UpdateRestockRequest,
  UpdateRestockResponse,
} from "../models/restockModel";
import { validation } from "../utils/validation";
import {
  createRestockSchema,
  updateRestockSchema,
} from "../schemas/restockSchema";
import { checkProductById, checkUser } from "./productService";
import { errorResponse, successResponse } from "../utils/response";
import { prisma } from "../config/db";

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
  req: CreateRestockRequest,
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
      costPrice: createRestockRequest.costPrice,
      userId: userId,
    },
    include: {
      product: true,
      user: true,
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

  return successResponse<CreateRestockResponse>(
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
      createdBy: {
        id: restock.user.id,
        name: restock.user.name,
      },
    },
    200,
  );
};

const updateRestockService = async (
  userId: number,
  restockId: number,
  req: UpdateRestockRequest,
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
      costPrice: updateRestockRequest.costPrice,
    },
    include: {
      product: true,
      user: true,
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

  return successResponse<UpdateRestockResponse>(
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
      createdBy: {
        id: restock.user.id,
        name: restock.user.name,
      },
    },
    200,
  );
};

export { createRestockService, updateRestockService };
