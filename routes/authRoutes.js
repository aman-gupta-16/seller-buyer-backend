// routes/authRoutes.js
import express from "express";
import { registerBuyer, registerSeller, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/registerBuyer", registerBuyer);
router.post("/registerSeller", registerSeller);
router.post("/login", loginUser);

export default router;
