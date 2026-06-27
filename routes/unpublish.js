import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const PACKAGES_FILE = path.join(process.cwd(), "packages.json");

function loadPackages() {
  return fs.existsSync(PACKAGES_FILE)
    ? JSON.parse(fs.readFileSync(PACKAGES_FILE, "utf8"))
    : {};
}

function savePackages(packages) {
  fs.writeFileSync(PACKAGES_FILE, JSON.stringify(packages, null, 2));
}

export default function unpublishRoute(req, res) {
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

    const packages = loadPackages();
    const pkg = packages[name];

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

    delete packages[name];
    savePackages(packages);

    res.json({
      message: `Unpublished ${name}`
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}