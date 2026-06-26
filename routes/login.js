// routes/login.js

import fs from "fs";
import path from "path";
import crypto from "crypto";

export default function loginRoute(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "username and password required"
      });
    }

    const authPath = path.join(process.cwd(), "auth.json");

    if (!fs.existsSync(authPath)) {
      return res.status(401).json({
        error: "invalid username or password"
      });
    }

    const users = JSON.parse(fs.readFileSync(authPath, "utf8"));
    const user = users[username];

    if (!user) {
      return res.status(401).json({
        error: "invalid username or password"
      });
    }

    const passwordHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (user.password !== passwordHash) {
      return res.status(401).json({
        error: "invalid username or password"
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.token = token;

    fs.writeFileSync(authPath, JSON.stringify(users, null, 2));

    res.json({
      success: true,
      message: "Login successful",
      token
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
