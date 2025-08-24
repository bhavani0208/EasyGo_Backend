import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import { swaggerDocs } from "./src/config/swagger.js";
import routes from "./src/routes/index.js";


dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_DEV || "http://localhost:3000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());




swaggerDocs(app);

// DB + Server start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
