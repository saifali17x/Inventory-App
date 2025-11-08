// db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
const { Pool } = pkg;

const isProd = process.env.NODE_ENV === "production";

// Use DATABASE_URL if available (Railway), otherwise use individual config
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ...(isProd ? { ssl: { rejectUnauthorized: false } } : {}),
    }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: String(process.env.DB_PASSWORD),
      port: parseInt(process.env.DB_PORT),
      ...(isProd ? { ssl: { rejectUnauthorized: false } } : {}),
    };

const pool = new Pool(poolConfig);

export default pool;
