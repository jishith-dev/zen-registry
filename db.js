// db.js
import postgres from "postgres";

export const sql = postgres(process.env.ZEN_DATABASE_URL);