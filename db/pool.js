// db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
const { Pool } = pkg;

const isProd = process.env.NODE_ENV === "production";
const isRailway =
  process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_PROJECT_ID;

// Force Railway to use correct database configuration with fallback
const poolConfig =
  isRailway || process.env.DATABASE_URL
    ? {
        connectionString:
          process.env.DATABASE_URL ||
          "postgresql://postgres:NrpzjStfDtpBRbtGuFofSiDUxkBiTDFd@shinkansen.proxy.rlwy.net:40659/railway",
        ...(isProd ? { ssl: { rejectUnauthorized: false } } : {}),
      }
    : {
        host: process.env.DB_HOST || "shinkansen.proxy.rlwy.net",
        user: process.env.DB_USER || "postgres",
        database: process.env.DB_NAME || "railway",
        password: String(
          process.env.DB_PASSWORD || "NrpzjStfDtpBRbtGuFofSiDUxkBiTDFd"
        ),
        port: parseInt(process.env.DB_PORT) || 40659,
        ...(isProd ? { ssl: { rejectUnauthorized: false } } : {}),
      };

const pool = new Pool(poolConfig);

export default pool;
