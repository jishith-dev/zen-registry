import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { validatePublish } from "../utils/validate.js";

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

function savePackages(packages) {
  fs.writeFileSync(PACKAGES_FILE, JSON.stringify(packages, null, 2));
}

export default function publishRoute(req, res) {
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

    const packages = loadPackages();
    const existing = packages[metadata.name];

    if (existing) {
      if (existing.author !== username) {
        return res.status(403).json({
          error: "You do not own this package"
        });
      }
      

const semver = (v) => v.split(".").map(Number);
if (semver(metadata.version) <= semver(existing.latest)) {
  return res.status(400).json({ error: "Version must be higher than the latest version" });
}

      existing.repo = metadata.repo;
      existing.description = metadata.description || "";
      existing.latest = metadata.version;

      savePackages(packages);

      return res.json({
        message: `Updated ${metadata.name} to v${metadata.version}`
      });
    }

    packages[metadata.name] = {
      author: metadata.author,
      repo: metadata.repo,
      description: metadata.description || "",
      latest: metadata.version
    };

    savePackages(packages);

    res.json({
      message: `Published ${metadata.name} v${metadata.version}`
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}