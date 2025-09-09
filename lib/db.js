import { Pool } from "pg";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// أضف هذه الدالة
export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

export default pool;
