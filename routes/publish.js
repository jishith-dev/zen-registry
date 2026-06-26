// routes/publish.js

import fs from "fs";
import path from "path";
import { validatePublish } from "../utils/validate.js";

export default function publishRoute(req, res) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    const authPath = path.join(process.cwd(), "auth.json");
    const users = JSON.parse(fs.readFileSync(authPath, "utf8"));

    const username = Object.keys(users).find(
      user => users[user].token === token
    );

    if (!username) {
      return res.status(401).json({
        error: "Invalid token"
      });
    }

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

    const packagesPath = path.join(process.cwd(), "packages.json");
    const packages = JSON.parse(fs.readFileSync(packagesPath, "utf8"));

    const existing = packages[metadata.name];

    if (existing) {
      if (existing.author !== username) {
        return res.status(403).json({
          error: "You do not own this package"
        });
      }

      if (metadata.version <= existing.latest) {
        return res.status(400).json({
          error: "Version must be higher than the latest version"
        });
      }

      existing.repo = metadata.repo;
      existing.description = metadata.description || "";
      existing.latest = metadata.version;

      fs.writeFileSync(packagesPath, JSON.stringify(packages, null, 2));

      return res.json({
        success: true,
        message: `Updated ${metadata.name} to v${metadata.version}`
      });
    }

    packages[metadata.name] = {
      author: metadata.author,
      repo: metadata.repo,
      description: metadata.description || "",
      latest: metadata.version
    };

    fs.writeFileSync(packagesPath, JSON.stringify(packages, null, 2));

    res.json({
      success: true,
      message: `Published ${metadata.name} v${metadata.version}`
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
