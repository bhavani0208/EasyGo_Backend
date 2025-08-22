// import express from "express";
// import cors from "cors";
// import { httpLogger } from "./src/utils/logger.js";
// import apiRouter from "./src/routes/index.js";
// import { swaggerMiddleware } from "./src/config/swagger.js";
// import { errorHandler } from "./src/middlewares/errorHandler.js";

// const app = express();

// // ✅ Secure CORS
// app.use(
//   cors({
//     origin: [
//       process.env.FRONTEND_DEV || "http://localhost:3000",
//       "http://localhost:5173",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(httpLogger);

// // Swagger UI at /api-docs
// app.use("/api-docs", ...swaggerMiddleware);

// // API routes under /api
// app.use("/api", apiRouter);

// // Global error handler
// app.use(errorHandler);

// export default app;
