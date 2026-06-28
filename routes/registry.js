import { sql } from "../db.js";

export default async function registryRoute(req, res) {
  try {
    const packageName = req.query.name;

    if (!packageName) {
      const all = await sql`SELECT name, author, description, latest, repo FROM packages ORDER BY created_at DESC`;
      return res.json(all);
    }
    
    if (!/^[a-z0-9_-]+$/.test(packageName) || packageName.length > 100) {
      return res.status(400).json({ error: "Invalid package name" });
    }

    const rows = await sql`SELECT * FROM packages WHERE name = ${packageName}`;
    const pkg = rows[0];

    if (!pkg) {
      return res.status(404).json({
        error: `Package '${packageName}' not found`
      });
    }

    res.json(pkg);
  } catch (err) {
    res.status(500).json({
      error: "registry error: " + err.message
    });
  }
}