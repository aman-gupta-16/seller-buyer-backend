// routes/projectRoutes.js
import express from "express";
import { createNewProject, getAllPendingProjects, selectSeller, uploadDeliverables } from "../controllers/projectControllers.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// Create a new project
router.post("/createNewProject",createNewProject);
// Get all pending projects (for sellers to view)
router.get("/getAllPendingProjects",getAllPendingProjects );

// Select Seller for a Project
router.put("/selectSeller",selectSeller );

router.post("/uploadDeliverables/:projectId", upload.single("deliverable"), (err, req, res, next) => {
    if (err) {
        console.log("Multer Error:", err);
        return res.status(400).json({ error: err.message });
    }
    next();
}, uploadDeliverables);



export default router;
