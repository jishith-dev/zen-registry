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

    const existing = await sql`
      SELECT * FROM packages
      WHERE name = ${metadata.name}
    `;

    /*
     * Existing package
     */
    if (existing.length > 0) {
      const pkg = existing[0];

      if (pkg.author !== username) {
        return res.status(403).json({
          error: "You do not own this package"
        });
      }

      // Check if this exact version already exists
      const existingVersion = await sql`
        SELECT id
        FROM package_versions
        WHERE package_id = ${pkg.id}
          AND version = ${metadata.version}
      `;

      if (existingVersion.length > 0) {
        return res.status(400).json({
          error: `${metadata.name}@${metadata.version} already exists`
        });
      }

      // Save the new version
      await sql`
        INSERT INTO package_versions
          (package_id, version, repo)
        VALUES
          (${pkg.id}, ${metadata.version}, ${metadata.repo})
      `;

      // Update latest package information
      await sql`
        UPDATE packages
        SET repo = ${metadata.repo},
            description = ${metadata.description || ""},
            latest = ${metadata.version},
            kind = ${metadata.kind}
        WHERE name = ${metadata.name}
      `;

      return res.json({
        message: `Published ${metadata.name} v${metadata.version}`
      });
    }

    /*
     * New package
     */

    const inserted = await sql`
      INSERT INTO packages
        (name, author, repo, description, latest, kind)
      VALUES
        (
          ${metadata.name},
          ${metadata.author},
          ${metadata.repo},
          ${metadata.description || ""},
          ${metadata.version},
          ${metadata.kind}
        )
      RETURNING id
    `;

    const packageId = inserted[0].id;

    // Save the first version
    await sql`
      INSERT INTO package_versions
        (package_id, version, repo)
      VALUES
        (${packageId}, ${metadata.version}, ${metadata.repo})
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