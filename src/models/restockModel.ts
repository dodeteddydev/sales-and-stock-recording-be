import { IdAndNameType } from "../types/idAndNameType";

export type CreateRestockRequest = {
  productId: number;
  qty: number;
  costPrice: number;
};

export type CreateRestockResponse = {
  id: number;
  qty: number;
  costPrice: number;
  product: IdAndNameType;
  createdAt: Date;
  createdBy: IdAndNameType;
};

export type UpdateRestockRequest = Omit<CreateRestockRequest, "productId">;

export type UpdateRestockResponse = CreateRestockResponse;
