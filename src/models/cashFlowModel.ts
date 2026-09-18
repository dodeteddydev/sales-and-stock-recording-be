import { Category, Type } from "../../generated/prisma/enums";
import { IdAndNameType } from "../types/idAndNameType";

export type CashFlowRequest = {
  type: Type;
  category: Category;
  amount: number;
  note: string;
};

export type CashFlowResponse = {
  id: number;
  type: Type;
  category: Category;
  amount: number;
  note: string;
  createdAt: Date;
  createdBy: IdAndNameType;
  updatedAt: Date;
  updatedBy: IdAndNameType | null;
};
