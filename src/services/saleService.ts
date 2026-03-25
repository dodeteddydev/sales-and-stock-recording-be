import { Response } from "express";
import { prisma } from "../config/db";
import { SaleParameters, SaleRequest, SaleResponse } from "../models/saleModel";
import { createSaleSchema, updateSaleSchema } from "../schemas/saleSchema";
import { errorResponse, successResponse } from "../utils/response";
import { validation } from "../utils/validation";
import { checkCustomerById } from "./customerService";
import { checkProductById, checkUser } from "./productService";
import { PaginationType } from "../types/paginationType";

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
  req: SaleRequest,
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

  const sale = await prisma.sale.create({
    data: {
      customerId: createSaleRequest.customerId,
      productId: createSaleRequest.productId,
      qty: createSaleRequest.qty,
      price: productExist.sellPrice,
      total: productExist.sellPrice * createSaleRequest.qty,
      userId: userId,
      cashflow: {
        create: {
          type: "IN",
          category: "SALE",
          amount: productExist.sellPrice * createSaleRequest.qty,
          note: `Sale ${productExist.name}`,
          userId: userId,
        },
      },
    },
    include: {
      customer: true,
      product: true,
      user: true,
    },
  });

  return successResponse<SaleResponse>(
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

const getSaleService = async (
  userId: number,
  req: SaleParameters,
  res: Response,
) => {
  await checkUser(userId, res);

  const page = req.page || 1;
  const limit = req.limit || 10;
  const customerId = req.customerId;
  const productId = req.productId;

  const skip = (page - 1) * limit;

  const where = {
    userId: userId,
    ...(customerId && { customerId: customerId }),
    ...(productId && { productId: productId }),
  };

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip,
      include: {
        user: true,
        product: true,
        customer: true,
      },
    }),
    prisma.sale.count({ where }),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return successResponse<PaginationType<SaleResponse>>(
    res,
    "Sales fetched successfully",
    {
      data: sales.map((sale) => ({
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

const updateSaleService = async (
  userId: number,
  saleId: number,
  req: SaleRequest,
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

  const sale = await prisma.sale.update({
    where: {
      id: saleId,
    },
    data: {
      customerId: updateSaleRequest.customerId,
      productId: updateSaleRequest.productId,
      qty: updateSaleRequest.qty,
      price: productExist.sellPrice,
      total: productExist.sellPrice * updateSaleRequest.qty,
      userId: userId,
      cashflow: {
        update: {
          type: "IN",
          category: "SALE",
          amount: productExist.sellPrice * updateSaleRequest.qty,
          note: `Sale ${productExist.name}`,
          userId: userId,
        },
      },
    },
    include: {
      customer: true,
      product: true,
      user: true,
    },
  });

  return successResponse<SaleResponse>(res, "Sale updated successfully", {
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

export { createSaleService, getSaleService, updateSaleService };
