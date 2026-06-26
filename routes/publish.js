// routes/publish.js

import fs from "fs";
import path from "path";
import { validatePublish } from "../utils/validate.js";

export default function publishRoute(req, res) {
  try {
    const metadata = req.body;

    const validation = validatePublish(metadata);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const packagesPath = path.join(process.cwd(), "packages.json");
    const packages = JSON.parse(fs.readFileSync(packagesPath, "utf8"));

    if (packages[metadata.name]) {
      return res.status(400).json({ error: `Package '${metadata.name}' already exists` });
    }

    packages[metadata.name] = {
      author: metadata.author,
      repo: metadata.repo,
      description: metadata.description || "",
      latest: metadata.version
      kind: metadata.main ? "main" : "bin"
    };

    fs.writeFileSync(packagesPath, JSON.stringify(packages, null, 2));

    res.json({ success: true, message: `Published ${metadata.name} v${metadata.version}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
