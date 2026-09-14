import express from "express";
import {
  createCustomerController,
  deleteCustomerController,
  getCustomerController,
  updateCustomerController,
} from "../controllers/customerController";

const router = express.Router();

router.post("/customer", createCustomerController);
router.get("/customer", getCustomerController);
router.put("/customer/:id", updateCustomerController);
router.delete("/customer/:id", deleteCustomerController);

export default router;
