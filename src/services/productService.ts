import { Response } from "express";
import { prisma } from "../config/db";
import { ProductRequest, ProductResponse } from "../models/productModel";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/productSchema";
import { PaginationType } from "../types/paginationType";
import { ParametersType } from "../types/parametersType";
import { errorResponse, successResponse } from "../utils/response";
import { validation } from "../utils/validation";
import { checkUser } from "./authService";

const checkProductByName = async (productName: string) => {
  const product = await prisma.product.findFirst({
    where: {
      name: productName,
    },
  });

  return product;
};

const checkProductById = async (productId: number) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      user: true,
      _count: {
        select: {
          restocks: true,
          sales: true,
        },
      },
    },
  });

  return product;
};

const createProductService = async (
  userId: number,
  req: ProductRequest,
  res: Response,
) => {
  const createProductRequest = validation(createProductSchema, req);

  await checkUser(userId, res);

  const productExist = await checkProductByName(createProductRequest.name);

  if (productExist) {
    return errorResponse(res, "Product already exist", null, 409);
  }

  const product = await prisma.product.create({
    data: {
      ...createProductRequest,
      createdById: userId,
    },
    include: {
      createdBy: true,
    },
  });

  return successResponse<ProductResponse>(
    res,
    "Product created successfully",
    {
      id: product.id,
      name: product.name,
      basePrice: product.basePrice,
      sellPrice: product.sellPrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      createdBy: {
        id: product.createdBy.id,
        name: product.createdBy.name,
      },
      updatedBy: null,
    },
    201,
  );
};

const getProductService = async (req: ParametersType, res: Response) => {
  const page = req.page || 1;
  const limit = req.limit || 10;
  const search = req.search ?? "";

  const skip = (page - 1) * limit;

  const where = {
    name: {
      contains: search,
    },
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit,
      skip,
      include: {
        createdBy: true,
        updatedBy: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return successResponse<PaginationType<ProductResponse>>(
    res,
    "Products fetched successfully",
    {
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        basePrice: product.basePrice,
        sellPrice: product.sellPrice,
        stock: product.stock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        createdBy: {
          id: product.createdBy.id,
          name: product.createdBy.name,
        },
        updatedBy: product.updatedBy
          ? {
              id: product.updatedBy.id,
              name: product.updatedBy.name,
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

const updateProductService = async (
  userId: number,
  productId: number,
  req: ProductRequest,
  res: Response,
) => {
  const updateProductRequest = validation(updateProductSchema, req);

  await checkUser(userId, res);

  const productExist = await checkProductById(productId);

  if (!productExist) {
    return errorResponse(res, "Product not found", null, 404);
  }

  if (productExist.name !== updateProductRequest.name) {
    const productExist = await checkProductByName(updateProductRequest.name);

    if (productExist) {
      return errorResponse(res, "Product already exist", null, 409);
    }
  }

  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      ...updateProductRequest,
      updatedById: userId,
    },
    include: {
      createdBy: true,
      updatedBy: true,
    },
  });

  return successResponse<ProductResponse>(
    res,
    "Product updated successfully",
    {
      id: product.id,
      name: product.name,
      basePrice: product.basePrice,
      sellPrice: product.sellPrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      createdBy: {
        id: product.createdBy.id,
        name: product.createdBy.name,
      },
      updatedBy: product.updatedBy
        ? {
            id: product.updatedBy.id,
            name: product.updatedBy.name,
          }
        : null,
    },
    200,
  );
};

const deleteProductService = async (
  userId: number,
  productId: number,
  res: Response,
) => {
  await checkUser(userId, res);

  const product = await checkProductById(productId);

  if (!product) {
    return errorResponse(res, "Product not found", null, 404);
  }

  if (product._count.restocks > 0 || product._count.sales > 0) {
    return errorResponse(
      res,
      "Delete product failed",
      "Product already used in transactions",
      409,
    );
  }

  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  return successResponse(res, "Product deleted successfully", null, 200);
};

export {
  checkProductById,
  checkUser,
  createProductService,
  getProductService,
  deleteProductService,
  updateProductService,
};
