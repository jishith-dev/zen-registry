import { sql } from "../db.js";

export default async function searchRoute(req, res) {
  try {
    const q = (req.query.q || "").trim();

    const packages = await sql`
      SELECT name, author, latest, description, kind
      FROM packages
      WHERE LOWER(name) LIKE LOWER(${`%${q}%`})
      ORDER BY name ASC
    `;

    res.json(packages);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}