import express from "express";
import {
  createCustomerController,
  deleteCustomerController,
  updateCustomerController,
} from "../controllers/customerController";

const router = express.Router();

router.post("/customer", createCustomerController);
router.put("/customer/:id", updateCustomerController);
router.delete("/customer/:id", deleteCustomerController);

export default router;
