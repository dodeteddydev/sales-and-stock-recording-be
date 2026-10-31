import z from "zod";

const positiveIdSchema = (label: string) =>
  z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? `${label} is required`
          : `${label} must be an integer`,
    })
    .int(`${label} must be an integer`)
    .positive(`${label} must be greater than zero`);

const saleItemSchema = z.object({
  productId: positiveIdSchema("Product ID"),
  qty: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Quantity is required"
          : "Quantity must be an integer",
    })
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than zero"),
});

const legacySaleSchema = z.object({
  customerId: positiveIdSchema("Customer ID"),
  productId: saleItemSchema.shape.productId,
  qty: saleItemSchema.shape.qty,
});

const createSaleSchema = z.union([
  z.object({
    customerId: positiveIdSchema("Customer ID"),
    items: z.array(saleItemSchema).min(1, "At least one sale item is required"),
  }),
  legacySaleSchema,
]);

const updateSaleSchema = createSaleSchema;

export { createSaleSchema, updateSaleSchema };
