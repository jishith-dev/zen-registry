// routes/unpublish.js

import fs from "fs";
import path from "path";

export default function unPublishRoute(req, res) {
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

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Package name is required"
      });
    }

    const packagesPath = path.join(process.cwd(), "packages.json");
    const packages = JSON.parse(fs.readFileSync(packagesPath, "utf8"));

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

    fs.writeFileSync(
      packagesPath,
      JSON.stringify(packages, null, 2)
    );

    res.json({
      success: true,
      message: `Unpublished ${name}`
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
