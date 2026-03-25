import { IdAndNameType } from "../types/idAndNameType";

export type ProductRequest = {
  name: string;
  basePrice: number;
  sellPrice: number;
  stock: number;
};

export type ProductResponse = {
  id: number;
  name: string;
  basePrice: number;
  sellPrice: number;
  stock: number;
  createdAt: Date;
  createdBy: IdAndNameType;
};
