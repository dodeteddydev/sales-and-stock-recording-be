import express from "express";
import {
  createProductController,
  deleteProductController,
  updateProductController,
} from "../controllers/productController";

const router = express.Router();

router.post("/product", createProductController);
router.put("/product/:id", updateProductController);
router.delete("/product/:id", deleteProductController);

export default router;
