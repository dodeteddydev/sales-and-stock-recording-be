import { IdAndNameType } from "../types/idAndNameType";

export type ProductRequest = {
  name: string;
  price: number;
  stock: number;
};

export type ProductResponse = {
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
  createdBy: IdAndNameType;
};
