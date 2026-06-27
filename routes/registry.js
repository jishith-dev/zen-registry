import fs from "fs";
import path from "path";

const PACKAGES_FILE = path.join(process.cwd(), "packages.json");

function loadPackages() {
  if (!fs.existsSync(PACKAGES_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(PACKAGES_FILE, "utf8"));
  } catch {
    console.error("packages.json corrupted");
    return {};
  }
}

export default function registryRoute(req, res) {
  try {
    const packages = loadPackages();
    const packageName = req.query.name;

    if (!packageName) {
      return res.json(packages);
    }
    
    if (packageName && (!/^[a-z0-9_-]+$/.test(packageName) || packageName.length > 100)) {
  return res.status(400).json({ error: "Invalid package name" });
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
      error: "registry error :" + err.message
    });
  }
}