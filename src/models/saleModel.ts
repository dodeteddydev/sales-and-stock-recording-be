import { IdAndNameType } from "../types/idAndNameType";

export type CreateSaleRequest = {
  customerId: number;
  productId: number;
  qty: number;
  price: number;
  total: number;
};

export type CreateSaleResponse = {
  id: number;
  qty: number;
  price: number;
  total: number;
  customer: IdAndNameType;
  product: IdAndNameType;
  createdAt: Date;
  createdBy: IdAndNameType;
};

export type UpdateSaleRequest = Omit<CreateSaleRequest, "productId">;

export type UpdateSaleResponse = CreateSaleResponse;
