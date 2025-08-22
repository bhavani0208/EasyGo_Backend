import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import { swaggerDocs } from "./src/config/swagger.js";
import authRoutes from "./src/routes/authRoutes.js";
import companyRoutes from "./src/routes/companyRoutes.js";
import branchRoutes from "./src/routes/branchRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/branches", branchRoutes);

swaggerDocs(app);

// DB + Server start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
