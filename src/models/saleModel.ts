import { IdAndNameType } from "../types/idAndNameType";
import { ParametersType } from "../types/parametersType";
import { z } from "zod";
import { createSaleSchema } from "../schemas/saleSchema";

export type SaleRequest = z.infer<typeof createSaleSchema>;

export type SaleLineResponse = {
  id: number;
  qty: number;
  price: number;
  total: number;
  product: IdAndNameType;
  createdAt: Date;
  createdBy: IdAndNameType;
  updatedAt: Date;
  updatedBy: IdAndNameType | null;
};

export type SaleResponse = {
  id: number;
  total: number;
  customer: IdAndNameType;
  items: SaleLineResponse[];
  createdAt: Date;
  createdBy: IdAndNameType;
  updatedAt: Date;
  updatedBy: IdAndNameType | null;
};

export type SaleParameters = ParametersType & {
  customerId?: number;
  productId?: number;
};
