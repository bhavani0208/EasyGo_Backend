import express from "express";
import cors from "cors";
import { httpLogger } from "./src/utils/logger.js";
import apiRouter from "./src/routes/index.js";
import { swaggerMiddleware } from "./src/config/swagger.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: "*", // allow all (for dev)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(httpLogger);

// Swagger UI at /api-docs
app.use("/api-docs", ...swaggerMiddleware);

// API routes under /api
app.use("/api", apiRouter);

// 404 for unknown API routes
app.use((req, res, next) => res.status(404).json({ message: "Not Found" }));

// error handler
app.use(errorHandler);

export default app;
