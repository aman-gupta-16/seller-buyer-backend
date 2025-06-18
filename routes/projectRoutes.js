// routes/projectRoutes.js
import express from "express";
import { createNewProject, getAllPendingProjects, selectSeller, uploadDeliverables } from "../controllers/projectControllers.js";
import { upload } from "../middlewares/multer.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new project
router.post("/createNewProject",protect,restrictTo("buyer"),createNewProject);
// Get all pending projects (for sellers to view)
router.get("/getAllPendingProjects",protect,restrictTo("seller"),getAllPendingProjects );

// Select Seller for a Project
router.put("/selectSeller",protect,restrictTo("buyer"),selectSeller );

router.post("/uploadDeliverables/:projectId", upload.single("deliverable"), protect,restrictTo("seller"), uploadDeliverables);



export default router;
