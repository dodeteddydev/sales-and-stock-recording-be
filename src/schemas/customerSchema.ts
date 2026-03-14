import z from "zod";

const createCustomerSchema = z.object({
  name: z
    .string("Name is required")
    .min(3, "Name must be at least 3 characters"),
  phone: z
    .string("Phone is required")
    .min(10, "Phone must be at least 10 characters"),
});

const updateCustomerSchema = createCustomerSchema;

export { createCustomerSchema, updateCustomerSchema };
