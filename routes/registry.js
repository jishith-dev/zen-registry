// routes/registry.js

import fs from "fs";
import path from "path";

export default function registryRoute(req, res) {
  try {
    const packagesPath = path.join(process.cwd(), "packages.json");
    const packages = JSON.parse(
      fs.readFileSync(packagesPath, "utf8")
    );

    const packageName = req.query.name;

    if (!packageName) {
      return res.json(packages);
    }

    const pkg = packages[packageName];

    if (!pkg) {
      return res.status(404).json({
        error: `Package '${packageName}' not found`
      });
    }

    res.json(pkg);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
