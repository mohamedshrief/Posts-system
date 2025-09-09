import { query } from "@/lib/db";

export async function GET() {
  const res = await query("SELECT * FROM news");
  return Response.json(res.rows);
}
