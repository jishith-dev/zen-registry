import jwt from "jsonwebtoken";
import { sql } from "../db.js";
import { validatePublish } from "../utils/validate.js";

export default async function publishRoute(req, res) {
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
        error: "Invalid or expired token. Please login again"
      });
    }

    const username = decoded.username;
    const metadata = req.body;

    const validation = validatePublish(metadata);
    if (!validation.valid) {
      return res.status(400).json({
        error: validation.error
      });
    }

    if (metadata.author !== username) {
      return res.status(403).json({
        error: "Author does not match logged in user"
      });
    }

    const existing = await sql`SELECT * FROM packages WHERE name = ${metadata.name}`;

    if (existing.length > 0) {
      const pkg = existing[0];
      
      if (pkg.author !== username) {
        return res.status(403).json({
          error: "You do not own this package"
        });
      }

      const semver = (v) => v.split(".").map(Number);
      if (semver(metadata.version) <= semver(pkg.latest)) {
        return res.status(400).json({ 
          error: "Version must be higher than the latest version" 
        });
      }

      await sql`
        UPDATE packages 
        SET repo = ${metadata.repo}, 
            description = ${metadata.description || ""}, 
            latest = ${metadata.version}
        WHERE name = ${metadata.name}
      `;

      return res.json({
        message: `Updated ${metadata.name} to v${metadata.version}`
      });
    }

    await sql`
      INSERT INTO packages (name, author, repo, description, latest)
      VALUES (${metadata.name}, ${metadata.author}, ${metadata.repo}, ${metadata.description || ""}, ${metadata.version})
    `;

    res.json({
      message: `Published ${metadata.name} v${metadata.version}`
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}