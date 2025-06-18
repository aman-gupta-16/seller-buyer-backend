// routes/projectRoutes.js
import express from "express";
import { awardedBidBySeller, createNewProject, getAllPendingProjects, getProject, getProjectsByBuyer, selectSeller, updateStatusOfProject, uploadDeliverables } from "../controllers/projectControllers.js";
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
router.get("/getProjectsByBuyer",protect,restrictTo("buyer"),getProjectsByBuyer)

router.get("/getProject/:projectId",protect,getProject);
router.get("/awardedBidBySeller",protect,restrictTo("seller"),awardedBidBySeller)
router.put("/updateStatusOfProject",protect,restrictTo("buyer"),updateStatusOfProject)

export default router;
