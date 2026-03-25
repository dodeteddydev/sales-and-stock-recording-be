import z from "zod";

const createProductSchema = z.object({
  name: z
    .string("Name is required")
    .min(3, "Name must be at least 3 characters"),
  basePrice: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Base Price is required"
          : "Base Price must be an integer",
    })
    .min(0, "Base Price must be at least 0")
    .int("Base Price must be an integer"),
  sellPrice: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Sell Price is required"
          : "Sell Price must be an integer",
    })
    .min(0, "Sell Price must be at least 0")
    .int("Sell Price must be an integer"),
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
