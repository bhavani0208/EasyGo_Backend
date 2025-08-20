import app from "./app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";
import { adminJs, router as adminRouter } from "./src/admin/admin.js";

const start = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${env.PORT}`);
      console.log(`📘 Swagger UI at http://localhost:${env.PORT}/api-docs`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};

start();
