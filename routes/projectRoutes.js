// routes/projectRoutes.js
import express from "express";
import { createNewProject } from "../controllers/projectControllers.js";

const router = express.Router();

// Create a new project
router.post("/createNewProject",createNewProject);

export default router;
