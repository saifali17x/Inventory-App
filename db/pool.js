// db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
const { Pool } = pkg;

const isProd = process.env.NODE_ENV === "production";

// For Railway, always use individual config to avoid URL parsing issues
const poolConfig = isProd
  ? {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: String(process.env.DB_PASSWORD), // Ensure password is a string
      port: parseInt(process.env.DB_PORT),
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: String(process.env.DB_PASSWORD), // Ensure password is a string
      port: parseInt(process.env.DB_PORT),
    };

const pool = new Pool(poolConfig);

export default pool;
