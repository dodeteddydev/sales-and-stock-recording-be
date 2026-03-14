import { IdAndNameType } from "../types/idAndNameType";

export type CreateCustomerRequest = {
  name: string;
  phone: string;
};

export type CreateCustomerResponse = {
  id: number;
  name: string;
  phone: string;
  createdAt: Date;
  createdBy: IdAndNameType;
};

export type UpdateCustomerRequest = CreateCustomerRequest;

export type UpdateCustomerResponse = CreateCustomerResponse;
