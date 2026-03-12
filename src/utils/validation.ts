import { ZodType } from "zod";

export const validation = <T>(schema: ZodType<T>, data: unknown): T =>
  schema.parse(data);
