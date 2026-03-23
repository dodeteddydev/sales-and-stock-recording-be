import express from "express";
import {
  createCashFlowController,
  updateCashFlowController,
} from "../controllers/cashFlowController";

const router = express.Router();

router.post("/cash-flow", createCashFlowController);
router.put("/cash-flow/:id", updateCashFlowController);

export default router;
