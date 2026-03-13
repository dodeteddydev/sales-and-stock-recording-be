import express from "express";
import {
  createRestockController,
  updateRestockController,
} from "../controllers/restockController";

const router = express.Router();

router.post("/restock", createRestockController);
router.put("/restock/:id", updateRestockController);

export default router;
