import { Response } from "express";
import { prisma } from "../config/db";
import { SaleParameters, SaleRequest, SaleResponse } from "../models/saleModel";
import { createSaleSchema, updateSaleSchema } from "../schemas/saleSchema";
import { PaginationType } from "../types/paginationType";
import { errorResponse, successResponse } from "../utils/response";
import { validation } from "../utils/validation";
import { checkUser } from "./productService";

type SaleItemInput = {
  productId: number;
  qty: number;
};

type SaleOrderData = {
  id: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  customer: { id: number; name: string };
  createdBy: { id: number; name: string };
  updatedBy: { id: number; name: string } | null;
  items: {
    id: number;
    qty: number;
    price: number;
    total: number;
    createdAt: Date;
    createdBy: { id: number; name: string };
    updatedAt: Date;
    updatedBy: { id: number; name: string } | null;
    product: { id: number; name: string };
  }[];
};

class SaleOperationError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
  }
}

const getItems = (request: SaleRequest): SaleItemInput[] =>
  "items" in request
    ? request.items
    : [{ productId: request.productId, qty: request.qty }];

const getRequestedQuantities = (items: SaleItemInput[]) => {
  const quantities = new Map<number, number>();

  for (const item of items) {
    quantities.set(
      item.productId,
      (quantities.get(item.productId) ?? 0) + item.qty,
    );
  }

  return quantities;
};

const formatSaleOrder = (order: SaleOrderData): SaleResponse => ({
  id: order.id,
  total: order.total,
  customer: {
    id: order.customer.id,
    name: order.customer.name,
  },
  items: order.items.map((item) => ({
    id: item.id,
    qty: item.qty,
    price: item.price,
    total: item.total,
    product: {
      id: item.product.id,
      name: item.product.name,
    },
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    createdBy: {
      id: item.createdBy.id,
      name: item.createdBy.name,
    },
    updatedBy: item.updatedBy
      ? {
          id: item.updatedBy.id,
          name: item.updatedBy.name,
        }
      : null,
  })),
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  createdBy: {
    id: order.createdBy.id,
    name: order.createdBy.name,
  },
  updatedBy: order.updatedBy
    ? {
        id: order.updatedBy.id,
        name: order.updatedBy.name,
      }
    : null,
});

const createSaleService = async (
  userId: number,
  req: SaleRequest,
  res: Response,
) => {
  const createSaleRequest = validation(createSaleSchema, req);
  const userCheck = await checkUser(userId, res);

  if (res.headersSent) {
    return userCheck;
  }

  const items = getItems(createSaleRequest);
  const requestedQuantities = getRequestedQuantities(items);

  try {
    const saleOrder = await prisma.$transaction(async (transaction) => {
      const customer = await transaction.customer.findUnique({
        where: { id: createSaleRequest.customerId },
      });

      if (!customer) {
        throw new SaleOperationError("Customer not found", 404);
      }

      const products = await transaction.product.findMany({
        where: { id: { in: [...requestedQuantities.keys()] } },
      });
      const productsById = new Map(
        products.map((product) => [product.id, product]),
      );

      for (const productId of requestedQuantities.keys()) {
        if (!productsById.has(productId)) {
          throw new SaleOperationError("Product not found", 404);
        }
      }

      for (const [productId, qty] of requestedQuantities) {
        const product = productsById.get(productId)!;
        const updated = await transaction.product.updateMany({
          where: {
            id: productId,
            stock: { gte: qty },
          },
          data: {
            stock: { decrement: qty },
          },
        });

        if (updated.count === 0) {
          throw new SaleOperationError(
            `Insufficient stock for ${product.name}. Only ${product.stock} item(s) available.`,
            400,
          );
        }
      }

      const total = items.reduce((sum, item) => {
        const product = productsById.get(item.productId)!;
        return sum + product.sellPrice * item.qty;
      }, 0);

      return transaction.saleOrder.create({
        data: {
          customerId: createSaleRequest.customerId,
          total,
          createdById: userId,
          items: {
            create: items.map((item) => {
              const product = productsById.get(item.productId)!;
              return {
                customerId: createSaleRequest.customerId,
                productId: item.productId,
                qty: item.qty,
                price: product.sellPrice,
                total: product.sellPrice * item.qty,
                createdById: userId,
              };
            }),
          },
          cashflow: {
            create: {
              type: "IN",
              category: "SALE",
              amount: total,
              note: "Sale checkout",
              createdById: userId,
            },
          },
        },
        include: {
          customer: true,
          createdBy: true,
          updatedBy: true,
          items: {
            include: {
              product: true,
              createdBy: true,
              updatedBy: true,
            },
          },
        },
      });
    });

    return successResponse<SaleResponse>(
      res,
      "Sale created successfully",
      formatSaleOrder(saleOrder),
      201,
    );
  } catch (error) {
    if (error instanceof SaleOperationError) {
      return errorResponse(res, error.message, null, error.statusCode);
    }

    throw error;
  }
};

const getSaleService = async (
  userId: number,
  req: SaleParameters,
  res: Response,
) => {
  const userCheck = await checkUser(userId, res);

  if (res.headersSent) {
    return userCheck;
  }

  const page = req.page || 1;
  const limit = req.limit || 10;
  const customerId = req.customerId;
  const productId = req.productId;
  const skip = (page - 1) * limit;

  const where = {
    ...(customerId && { customerId }),
    ...(productId && { items: { some: { productId } } }),
  };

  const [saleOrders, total] = await Promise.all([
    prisma.saleOrder.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit,
      skip,
      include: {
        customer: true,
        createdBy: true,
        updatedBy: true,
        items: {
          include: {
            product: true,
            createdBy: true,
            updatedBy: true,
          },
        },
      },
    }),
    prisma.saleOrder.count({ where }),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return successResponse<PaginationType<SaleResponse>>(
    res,
    "Sales fetched successfully",
    {
      data: saleOrders.map((saleOrder) => formatSaleOrder(saleOrder)),
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
  const userCheck = await checkUser(userId, res);

  if (res.headersSent) {
    return userCheck;
  }

  const items = getItems(updateSaleRequest);
  const requestedQuantities = getRequestedQuantities(items);

  try {
    const saleOrder = await prisma.$transaction(async (transaction) => {
      const existingOrder = await transaction.saleOrder.findUnique({
        where: { id: saleId },
        include: {
          items: true,
          cashflow: true,
        },
      });

      if (!existingOrder) {
        throw new SaleOperationError("Sale not found", 404);
      }

      const customer = await transaction.customer.findUnique({
        where: { id: updateSaleRequest.customerId },
      });

      if (!customer) {
        throw new SaleOperationError("Customer not found", 404);
      }

      const productIds = [
        ...new Set([
          ...existingOrder.items.map((item) => item.productId),
          ...requestedQuantities.keys(),
        ]),
      ];
      const products = await transaction.product.findMany({
        where: { id: { in: productIds } },
      });
      const productsById = new Map(
        products.map((product) => [product.id, product]),
      );

      for (const productId of requestedQuantities.keys()) {
        if (!productsById.has(productId)) {
          throw new SaleOperationError("Product not found", 404);
        }
      }

      const oldQuantities = getRequestedQuantities(existingOrder.items);

      for (const [productId, qty] of oldQuantities) {
        await transaction.product.update({
          where: { id: productId },
          data: { stock: { increment: qty } },
        });
      }

      const restoredProducts = await transaction.product.findMany({
        where: { id: { in: [...requestedQuantities.keys()] } },
      });
      const restoredProductsById = new Map(
        restoredProducts.map((product) => [product.id, product]),
      );

      for (const [productId, qty] of requestedQuantities) {
        const product = restoredProductsById.get(productId)!;
        const updated = await transaction.product.updateMany({
          where: {
            id: productId,
            stock: { gte: qty },
          },
          data: { stock: { decrement: qty } },
        });

        if (updated.count === 0) {
          throw new SaleOperationError(
            `Insufficient stock for ${product.name}. Only ${product.stock} item(s) available.`,
            400,
          );
        }
      }

      const total = items.reduce((sum, item) => {
        const product = productsById.get(item.productId)!;
        return sum + product.sellPrice * item.qty;
      }, 0);

      await transaction.sale.deleteMany({
        where: { saleOrderId: saleId },
      });

      return transaction.saleOrder.update({
        where: { id: saleId },
        data: {
          customerId: updateSaleRequest.customerId,
          total,
          updatedById: userId,
          items: {
            create: items.map((item) => {
              const product = productsById.get(item.productId)!;
              return {
                customerId: updateSaleRequest.customerId,
                productId: item.productId,
                qty: item.qty,
                price: product.sellPrice,
                total: product.sellPrice * item.qty,
                createdById: userId,
              };
            }),
          },
          cashflow: existingOrder.cashflow
            ? {
                update: {
                  type: "IN",
                  category: "SALE",
                  amount: total,
                  note: "Sale checkout",
                  updatedById: userId,
                },
              }
            : {
                create: {
                  type: "IN",
                  category: "SALE",
                  amount: total,
                  note: "Sale checkout",
                  createdById: userId,
                },
              },
        },
        include: {
          customer: true,
          createdBy: true,
          updatedBy: true,
          items: {
            include: {
              product: true,
              createdBy: true,
              updatedBy: true,
            },
          },
        },
      });
    });

    return successResponse<SaleResponse>(
      res,
      "Sale updated successfully",
      formatSaleOrder(saleOrder),
    );
  } catch (error) {
    if (error instanceof SaleOperationError) {
      return errorResponse(res, error.message, null, error.statusCode);
    }

    throw error;
  }
};

export { createSaleService, getSaleService, updateSaleService };
