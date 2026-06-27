import fs from "fs";
import path from "path";

const PACKAGES_FILE = path.join(process.cwd(), "packages.json");

function loadPackages() {
  return fs.existsSync(PACKAGES_FILE)
    ? JSON.parse(fs.readFileSync(PACKAGES_FILE, "utf8"))
    : {};
}

export default function registryRoute(req, res) {
  try {
    const packages = loadPackages();
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