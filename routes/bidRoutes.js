import express from "express";
import { createNewBid, getBidForProjects } from "../controllers/bidControllers.js";

const router = express.Router();

// Create a new bid
router.post("/createNewBid",createNewBid );

//Get Bid for Project
router.get("/getBidForProjects/:projectId",getBidForProjects)


export default router;
