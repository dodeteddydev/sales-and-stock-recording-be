import { Response } from "express";
import { prisma } from "../config/db";
import {
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from "../models/productModel";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/productSchema";
import { errorResponse, successResponse } from "../utils/response";
import { validation } from "../utils/validation";

const checkUser = async (userId: number, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return errorResponse(res, "Unauthorized", "Invalid token", 401);
  }
};

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
  req: CreateProductRequest,
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
      name: createProductRequest.name,
      price: createProductRequest.price,
      stock: createProductRequest.stock,
      userId: userId,
    },
    include: {
      user: true,
    },
  });

  return successResponse<CreateProductResponse>(
    res,
    "Product created successfully",
    {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      createdBy: {
        id: product.user.id,
        name: product.user.username,
      },
    },
    201,
  );
};

const updateProductService = async (
  userId: number,
  productId: number,
  req: UpdateProductRequest,
  res: Response,
) => {
  const updateProductRequest = validation(updateProductSchema, req);

  await checkUser(userId, res);

  if (req.name !== updateProductRequest.name) {
    const productExist = await checkProductByName(updateProductRequest.name);

    if (productExist) {
      return errorResponse(res, "Product already exist", null, 409);
    }
  }

  const product = await checkProductById(productId);

  if (!product) {
    return errorResponse(res, "Product not found", null, 404);
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: updateProductRequest,
  });

  return successResponse<UpdateProductResponse>(
    res,
    "Product updated successfully",
    {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      createdBy: {
        id: product.user.id,
        name: product.user.username,
      },
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

export { createProductService, deleteProductService, updateProductService };
