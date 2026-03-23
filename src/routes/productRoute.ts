import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductController,
  updateProductController,
} from "../controllers/productController";

const router = express.Router();

router.post("/product", createProductController);
router.get("/product", getProductController);
router.put("/product/:id", updateProductController);
router.delete("/product/:id", deleteProductController);

export default router;
