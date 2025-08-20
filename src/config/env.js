import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/employee-routing",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-me",
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  ORS_API_KEY: process.env.ORS_API_KEY,
};
