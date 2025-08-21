import express from "express";
import cors from "cors";
import { httpLogger } from "./src/utils/logger.js";
import apiRouter from "./src/routes/index.js";
import { swaggerMiddleware } from "./src/config/swagger.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { adminJs, router as adminRouter } from "./src/admin/admin.js";
const app = express();

const allowedOrigins = [
  process.env.FRONTEND_DEV || "http://localhost:3000", // Dev frontend
];

// ✅ Secure CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(httpLogger);

// Swagger UI at /api-docs
app.use("/api-docs", ...swaggerMiddleware);

app.use(adminJs.options.rootPath, adminRouter);

// API routes under /api
app.use("/api", apiRouter);

// 404 for unknown API routes
app.use((req, res, next) => res.status(404).json({ message: "Not Found" }));

// error handler
app.use(errorHandler);

export default app;
