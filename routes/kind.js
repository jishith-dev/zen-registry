import { sql } from "../db.js";

export default async function kindRoute(req, res) {
  try {
    const name = req.query.name;

    if (!name) {
      return res.status(400).json({
        error: "Package name required"
      });
    }

    const rows = await sql`
      SELECT kind
      FROM packages
      WHERE name = ${name}
    `;

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Package not found"
      });
    }

    res.json({
      kind: rows[0].kind
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}