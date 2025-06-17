import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/projectRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/projects", projectRoutes);
app.use("/bids", bidRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
