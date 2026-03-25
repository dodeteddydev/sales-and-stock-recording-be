import express from "express";
import { dashboardController } from "../controllers/dashboardController";

const router = express.Router();

router.get("/dashboard", dashboardController);

export default router;
