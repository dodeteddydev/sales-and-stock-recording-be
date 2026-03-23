import z from "zod";

const createCashFlowSchema = z.object({
  type: z.enum(["IN", "OUT"], {
    error: "Type must be one of the following: IN, OUT",
  }),
  category: z.enum(["SALE", "RESTOCK", "LOAN", "RETURN"], {
    error: "Category must be one of the following: SALE, RESTOCK, LOAN, RETURN",
  }),
  amount: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "Amount is required"
          : "Amount must be an integer",
    })
    .int("Amount must be an integer"),
  note: z
    .string("Note is required")
    .min(3, "Note must be at least 3 characters"),
});

const updateCashFlowSchema = createCashFlowSchema;

export { createCashFlowSchema, updateCashFlowSchema };
