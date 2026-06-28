import { sql } from "../db.js";

export default async function listRoute(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 50;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await sql`SELECT COUNT(*) as count FROM packages`;
    const total = countResult[0].count;

    // Get paginated packages
    const packages = await sql`
      SELECT name, author, description, latest, repo 
      FROM packages 
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const hasMore = offset + limit < total;

    res.json({
      page,
      limit,
      total,
      hasMore,
      count: packages.length,
      packages
    });
  } catch (err) {
    console.error("List error:", err);
    res.status(500).json({
      error: "list failed"
    });
  }
}