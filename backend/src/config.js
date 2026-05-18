import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: Number(process.env.PORT) || 3001,
  scanIntervalMinutes: Number(process.env.SCAN_INTERVAL_MINUTES) || 5,
  firebaseServiceAccountPath: path.resolve(
    __dirname,
    "..",
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "../frontend/service-account.json"
  ),
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  minConfidence: Number(process.env.MIN_CONFIDENCE) || 0.55,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};
