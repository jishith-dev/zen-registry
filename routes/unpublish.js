import jwt from "jsonwebtoken";
import { sql } from "../db.js";

export default async function unpublishRoute(req, res) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: "Invalid or expired token"
      });
    }

    const username = decoded.username;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Package name is required"
      });
    }

    const rows = await sql`SELECT * FROM packages WHERE name = ${name}`;
    const pkg = rows[0];

    if (!pkg) {
      return res.status(404).json({
        error: `Package '${name}' not found`
      });
    }

    if (pkg.author !== username) {
      return res.status(403).json({
        error: "You do not own this package"
      });
    }

    await sql`DELETE FROM packages WHERE name = ${name}`;

    res.json({
      message: `Unpublished ${name}`
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}