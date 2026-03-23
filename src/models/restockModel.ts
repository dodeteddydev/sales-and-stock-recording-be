import { IdAndNameType } from "../types/idAndNameType";

export type RestockRequest = {
  productId: number;
  qty: number;
};

export type RestockResponse = {
  id: number;
  qty: number;
  costPrice: number;
  product: IdAndNameType;
  createdAt: Date;
  createdBy: IdAndNameType;
};
