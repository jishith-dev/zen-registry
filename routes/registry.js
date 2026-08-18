import { sql } from "../db.js";

export default async function registryRoute(req, res) {
  try {
    const packageName = req.query.name;
    const version = req.query.version;

    if (!packageName) {
      const all = await sql`
        SELECT name, author, description, latest, repo
        FROM packages
        ORDER BY created_at DESC
      `;

      return res.json(all);
    }

    if (!/^[a-z0-9_-]+$/.test(packageName) || packageName.length > 100) {
      return res.status(400).json({
        error: "Invalid package name"
      });
    }

    const rows = await sql`
      SELECT * FROM packages
      WHERE name = ${packageName}
    `;

    const pkg = rows[0];

    if (!pkg) {
      return res.status(404).json({
        error: `Package '${packageName}' not found`
      });
    }

    // No version requested → return latest
    if (!version) {
      return res.json(pkg);
    }

    // Validate version
    if (!/^\d+\.\d+\.\d+$/.test(version)) {
      return res.status(400).json({
        error: "Invalid version. Expected x.y.z"
      });
    }

    // Find requested version
    const versions = await sql`
      SELECT version, repo
      FROM package_versions
      WHERE package_id = ${pkg.id}
        AND version = ${version}
    `;

    if (versions.length === 0) {
      return res.status(404).json({
        error: `Package '${packageName}@${version}' not found`
      });
    }

    // Return package metadata with requested version
    res.json({
      ...pkg,
      version: versions[0].version,
      repo: versions[0].repo
    });

  } catch (err) {
    res.status(500).json({
      error: "registry error: " + err.message
    });
  }
}