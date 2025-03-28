
import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.USER_NAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

export default async function dbconnect() {
  try {
    await pool.connect();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}
