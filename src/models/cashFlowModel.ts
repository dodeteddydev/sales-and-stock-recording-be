import { Category, Type } from "../../generated/prisma/enums";
import { IdAndNameType } from "../types/idAndNameType";
import { ParametersType } from "../types/parametersType";

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

export type CashFlowParameters = ParametersType & {
  type?: Type;
  category?: Category;
};
