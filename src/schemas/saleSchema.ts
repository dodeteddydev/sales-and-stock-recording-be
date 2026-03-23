import z from "zod";

const createSaleSchema = z.object({
  customerId: z.number({
    error: (iss) =>
      iss.input === undefined
        ? "Customer ID is required"
        : "Customer ID must be an integer",
  }),
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
  price: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Cost price is required"
          : "Cost price must be an integer",
    })
    .int("Cost price must be an integer"),
  total: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Total is required"
          : "Total must be an integer",
    })
    .int("Total must be an integer"),
});

const updateSaleSchema = createSaleSchema;

export { createSaleSchema, updateSaleSchema };
