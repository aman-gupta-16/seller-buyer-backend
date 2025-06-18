import express from "express";
import { createNewBid, getBidForProjects } from "../controllers/bidControllers.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new bid
router.post("/createNewBid",protect,restrictTo("seller"),createNewBid );

//Get Bid for Project
router.get("/getBidForProjects/:projectId",protect,restrictTo("buyer"),getBidForProjects)


export default router;
