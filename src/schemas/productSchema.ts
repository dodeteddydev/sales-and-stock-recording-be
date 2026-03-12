import z from "zod";

const createProductSchema = z.object({
  name: z
    .string("Name is required")
    .min(3, "Name must be at least 3 characters"),
  price: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Price is required"
          : "Price must be an integer",
    })
    .min(0, "Price must be at least 0")
    .int("Price must be an integer"),
  stock: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Stock is required"
          : "Stock must be an integer",
    })
    .min(0, "Stock must be at least 0")
    .int("Stock must be an integer"),
});

const updateProductSchema = createProductSchema;

export { createProductSchema, updateProductSchema };
