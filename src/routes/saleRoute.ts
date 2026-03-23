import express from "express";
import {
  createSaleController,
  updateSaleController,
} from "../controllers/saleController";

const router = express.Router();

router.post("/sale", createSaleController);
router.put("/sale/:id", updateSaleController);

export default router;
