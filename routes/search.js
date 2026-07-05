import { sql } from "../db.js";

export default async function searchRoute(req, res) {
  try {
    const q = (req.query.name || "").trim();

    if (!q) {
      return res.status(400).json({
        error: "Query parameter 'name' is required"
      });
    }

    if (q.length > 100) {
      return res.status(400).json({
        error: "Search query too long (max 100 characters)"
      });
    }

    if (!/^[a-zA-Z0-9_\-\s]+$/.test(q)) {
      return res.status(400).json({
        error: "Search query contains invalid characters"
      });
    }

    const packages = await sql`
      SELECT name, author, latest, description, kind
      FROM packages
      WHERE LOWER(name) LIKE LOWER(${`%${q}%`})
         OR LOWER(description) LIKE LOWER(${`%${q}%`})
      ORDER BY name ASC
    `;

    if (packages.length === 0) {
      return res.status(404).json({
        error: `No packages found matching "${q}"`
      });
    }

    res.json(packages);

  } catch (err) {
    res.status(500).json({
      error: "Internal server error while searching packages"
    });
  }
}