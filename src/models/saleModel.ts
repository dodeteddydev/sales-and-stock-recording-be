import { IdAndNameType } from "../types/idAndNameType";
import { ParametersType } from "../types/parametersType";

export type SaleRequest = {
  customerId: number;
  productId: number;
  qty: number;
};

export type SaleResponse = {
  id: number;
  qty: number;
  price: number;
  total: number;
  customer: IdAndNameType;
  product: IdAndNameType;
  createdAt: Date;
  createdBy: IdAndNameType;
  updatedAt: Date;
  updatedBy: IdAndNameType | null;
};

export type SaleParameters = ParametersType & {
  customerId?: number;
  productId?: number;
};
