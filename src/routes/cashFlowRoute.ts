import express from "express";
import {
  createCashFlowController,
  getCashFlowController,
  updateCashFlowController,
} from "../controllers/cashFlowController";

const router = express.Router();

router.post("/cash-flow", createCashFlowController);
router.get("/cash-flow", getCashFlowController);
router.put("/cash-flow/:id", updateCashFlowController);

export default router;
