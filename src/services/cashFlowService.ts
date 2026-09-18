import { Response } from "express";
import { prisma } from "../config/db";
import { CashFlowRequest, CashFlowResponse } from "../models/cashFlowModel";
import {
  createCashFlowSchema,
  updateCashFlowSchema,
} from "../schemas/cashFlowSchema";
import { errorResponse, successResponse } from "../utils/response";
import { validation } from "../utils/validation";
import { checkUser } from "./productService";
import { Category, Type } from "../../generated/prisma/enums";

const checkCashFlowById = async (cashFlowId: number) => {
  const cashFlow = await prisma.cashFlow.findUnique({
    where: {
      id: cashFlowId,
    },
  });

  return cashFlow;
};

const createCashFlowService = async (
  userId: number,
  req: CashFlowRequest,
  res: Response,
) => {
  const createCashFlowRequest = validation(createCashFlowSchema, req);

  await checkUser(userId, res);

  if (createCashFlowRequest.type === Type.IN) {
    if (
      createCashFlowRequest.category === Category.RESTOCK ||
      createCashFlowRequest.category === Category.LOAN
    ) {
      return errorResponse(res, "Cash flow type cannot be IN", null, 400);
    }
  } else if (createCashFlowRequest.type === Type.OUT) {
    if (
      createCashFlowRequest.category === Category.SALE ||
      createCashFlowRequest.category === Category.RETURN
    ) {
      return errorResponse(res, "Cash flow type cannot be OUT", null, 400);
    }
  }

  const cashFlow = await prisma.cashFlow.create({
    data: {
      ...createCashFlowRequest,
      createdById: userId,
    },
    include: {
      createdBy: true,
    },
  });

  return successResponse<CashFlowResponse>(
    res,
    "Cash flow created successfully",
    {
      id: cashFlow.id,
      type: cashFlow.type,
      category: cashFlow.category,
      amount: cashFlow.amount,
      note: cashFlow.note,
      createdAt: cashFlow.createdAt,
      updatedAt: cashFlow.updatedAt,
      createdBy: {
        id: cashFlow.createdBy.id,
        name: cashFlow.createdBy.name,
      },
      updatedBy: null,
    },
    201,
  );
};

const updateCashFlowService = async (
  userId: number,
  CashFlowId: number,
  req: CashFlowRequest,
  res: Response,
) => {
  const updateCashFlowRequest = validation(updateCashFlowSchema, req);

  await checkUser(userId, res);

  const cashFlowExist = await checkCashFlowById(CashFlowId);

  if (!cashFlowExist) {
    return errorResponse(res, "Cash flow not found", null, 404);
  }

  if (updateCashFlowRequest.type === Type.IN) {
    if (
      updateCashFlowRequest.category === Category.RESTOCK ||
      updateCashFlowRequest.category === Category.LOAN
    ) {
      return errorResponse(res, "Cash flow type cannot be IN", null, 400);
    }
  } else if (updateCashFlowRequest.type === Type.OUT) {
    if (
      updateCashFlowRequest.category === Category.SALE ||
      updateCashFlowRequest.category === Category.RETURN
    ) {
      return errorResponse(res, "Cash flow type cannot be OUT", null, 400);
    }
  }

  const cashFlow = await prisma.cashFlow.update({
    where: {
      id: CashFlowId,
    },
    data: {
      ...updateCashFlowRequest,
      updatedById: userId,
    },
    include: {
      createdBy: true,
      updatedBy: true,
    },
  });

  return successResponse(res, "Cash flow updated successfully", {
    id: cashFlow.id,
    type: cashFlow.type,
    category: cashFlow.category,
    amount: cashFlow.amount,
    note: cashFlow.note,
    createdAt: cashFlow.createdAt,
    updatedAt: cashFlow.updatedAt,
    createdBy: {
      id: cashFlow.createdBy.id,
      name: cashFlow.createdBy.name,
    },
    updatedBy: cashFlow.updatedBy
      ? {
          id: cashFlow.updatedBy.id,
          name: cashFlow.updatedBy.name,
        }
      : null,
  });
};

export { createCashFlowService, updateCashFlowService };
