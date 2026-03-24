import express from "express";
import {
  createSaleController,
  getSaleController,
  updateSaleController,
} from "../controllers/saleController";

const router = express.Router();

router.post("/sale", createSaleController);
router.get("/sale", getSaleController);
router.put("/sale/:id", updateSaleController);

export default router;
