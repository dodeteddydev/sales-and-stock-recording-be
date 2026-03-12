import { IdAndNameType } from "../types/idAndNameType";

export type CreateProductRequest = {
  name: string;
  price: number;
  stock: number;
};

export type CreateProductResponse = {
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
  createdBy: IdAndNameType;
};

export type UpdateProductRequest = CreateProductRequest;

export type UpdateProductResponse = CreateProductResponse;
