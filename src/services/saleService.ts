import { Response } from "express";
import { prisma } from "../config/db";
import { CreateSaleRequest, CreateSaleResponse } from "../models/saleModel";
import { createSaleSchema, updateSaleSchema } from "../schemas/saleSchema";
import { errorResponse, successResponse } from "../utils/response";
import { validation } from "../utils/validation";
import { checkCustomerById } from "./customerService";
import { checkProductById, checkUser } from "./productService";

const checkSaleById = async (saleId: number) => {
  const sale = await prisma.sale.findUnique({
    where: {
      id: saleId,
    },
  });

  return sale;
};

const createSaleService = async (
  userId: number,
  req: CreateSaleRequest,
  res: Response,
) => {
  const createSaleRequest = validation(createSaleSchema, req);

  await checkUser(userId, res);

  const customerExist = await checkCustomerById(createSaleRequest.customerId);

  if (!customerExist) {
    return errorResponse(res, "Customer not found", null, 404);
  }

  const productExist = await checkProductById(createSaleRequest.productId);

  if (!productExist) {
    return errorResponse(res, "Product not found", null, 404);
  }

  const total = createSaleRequest.price * createSaleRequest.qty;

  if (total !== createSaleRequest.total) {
    return errorResponse(res, "Invalid total", null, 400);
  }

  const sale = await prisma.sale.create({
    data: {
      customerId: createSaleRequest.customerId,
      productId: createSaleRequest.productId,
      qty: createSaleRequest.qty,
      price: createSaleRequest.price,
      total: createSaleRequest.total,
      userId: userId,
    },
    include: {
      customer: true,
      product: true,
      user: true,
    },
  });

  return successResponse<CreateSaleResponse>(
    res,
    "Sale created successfully",
    {
      id: sale.id,
      qty: sale.qty,
      price: sale.price,
      total: sale.total,
      customer: {
        id: sale.customer.id,
        name: sale.customer.name,
      },
      product: {
        id: sale.product.id,
        name: sale.product.name,
      },
      createdAt: sale.createdAt,
      createdBy: {
        id: sale.user.id,
        name: sale.user.name,
      },
    },
    201,
  );
};

const updateSaleService = async (
  userId: number,
  saleId: number,
  req: CreateSaleRequest,
  res: Response,
) => {
  const updateSaleRequest = validation(updateSaleSchema, req);

  await checkUser(userId, res);

  const saleExist = await checkSaleById(saleId);

  if (!saleExist) {
    return errorResponse(res, "Sale not found", null, 404);
  }

  const customerExist = await checkCustomerById(updateSaleRequest.customerId);

  if (!customerExist) {
    return errorResponse(res, "Customer not found", null, 404);
  }

  const productExist = await checkProductById(updateSaleRequest.productId);

  if (!productExist) {
    return errorResponse(res, "Product not found", null, 404);
  }

  const total = updateSaleRequest.price * updateSaleRequest.qty;

  if (total !== updateSaleRequest.total) {
    return errorResponse(res, "Invalid total", null, 400);
  }

  const sale = await prisma.sale.update({
    where: {
      id: saleId,
    },
    data: {
      customerId: updateSaleRequest.customerId,
      productId: updateSaleRequest.productId,
      qty: updateSaleRequest.qty,
      price: updateSaleRequest.price,
      total: updateSaleRequest.total,
      userId: userId,
    },
    include: {
      customer: true,
      product: true,
      user: true,
    },
  });

  return successResponse<CreateSaleResponse>(res, "Sale updated successfully", {
    id: sale.id,
    qty: sale.qty,
    price: sale.price,
    total: sale.total,
    customer: {
      id: sale.customer.id,
      name: sale.customer.name,
    },
    product: {
      id: sale.product.id,
      name: sale.product.name,
    },
    createdAt: sale.createdAt,
    createdBy: {
      id: sale.user.id,
      name: sale.user.name,
    },
  });
};

export { createSaleService, updateSaleService };
