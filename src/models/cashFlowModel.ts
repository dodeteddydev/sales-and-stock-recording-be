import { Category, Type } from "../../generated/prisma/enums";
import { IdAndNameType } from "../types/idAndNameType";

export type CreateCashFlowRequest = {
  type: Type;
  category: Category;
  amount: number;
  note: string;
};

export type CreateCashFlowResponse = {
  id: number;
  type: Type;
  category: Category;
  amount: number;
  note: string;
  createdAt: Date;
  createdBy: IdAndNameType;
};

export type UpdateCashFlowRequest = CreateCashFlowRequest;

export type UpdateCashFlowResponse = CreateCashFlowResponse;
