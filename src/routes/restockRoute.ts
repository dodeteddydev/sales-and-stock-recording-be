import express from "express";
import {
  createRestockController,
  getRestockController,
  updateRestockController,
} from "../controllers/restockController";

const router = express.Router();

router.post("/restock", createRestockController);
router.get("/restock", getRestockController);
router.put("/restock/:id", updateRestockController);

export default router;
