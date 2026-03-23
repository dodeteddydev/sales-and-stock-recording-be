import z from "zod";

const createRestockSchema = z.object({
  productId: z.number({
    error: (iss) =>
      iss.input === undefined
        ? "Product ID is required"
        : "Product ID must be an integer",
  }),
  qty: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Quantity is required"
          : "Quantity must be an integer",
    })
    .int("Quantity must be an integer"),
});

const updateRestockSchema = createRestockSchema.omit({
  productId: true,
});

export { createRestockSchema, updateRestockSchema };
