import { IdAndNameType } from "../types/idAndNameType";

export type CustomerRequest = {
  name: string;
  phone: string;
};

export type CustomerResponse = {
  id: number;
  name: string;
  phone: string;
  createdAt: Date;
  createdBy: IdAndNameType;
};
