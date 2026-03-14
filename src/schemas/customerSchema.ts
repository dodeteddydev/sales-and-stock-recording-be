import z from "zod";

const createCustomerSchema = z.object({
  name: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Name is required" : "Name must be a string",
    })
    .min(3, "Name must be at least 3 characters"),
  phone: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Phone is required"
          : "Phone must be a string",
    })
    .min(10, "Phone must be at least 10 characters"),
});

const updateCustomerSchema = createCustomerSchema;

export { createCustomerSchema, updateCustomerSchema };
