import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/projectRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import authRoutes from "./routes/authRoutes.js"



dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: ['http://localhost:3000', 'https://bid-connect.vercel.app/'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/projects", projectRoutes);
app.use("/bids", bidRoutes);
app.use("/auth",authRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
