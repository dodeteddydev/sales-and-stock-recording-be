import express from "express";
import {
  loginController,
  refreshTokenController,
  registerController,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);

export default router;
