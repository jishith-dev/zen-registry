import jwt from "jsonwebtoken";
import { sql } from "../db.js";

export default async function mineRoute(req, res) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const packages = await sql`
      SELECT name, latest, description, kind
      FROM packages
      WHERE author = ${decoded.username}
      ORDER BY name ASC
    `;

    res.json(packages);

  } catch (err) {
    res.status(401).json({
      error: "Invalid or expired token"
    });
  }
}