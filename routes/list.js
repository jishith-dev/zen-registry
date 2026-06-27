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

export default function listRoute(req, res) {
  try {
    const packages = loadPackages();
    const list = Object.entries(packages).map(([name, data]) => ({
      name,
      author: data.author,
      description: data.description,
      latest: data.latest,
      repo: data.repo
    }));

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 50;
    const offset = (page - 1) * limit;
    const total = list.length;
    const paged = list.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    res.json({
      page,
      limit,
      total,
      hasMore,
      count: paged.length,
      packages: paged
    });
  } catch (err) {
    console.error("List error:", err);
    res.status(500).json({
      error: "list failed"
    });
  }
}
