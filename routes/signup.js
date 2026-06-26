// routes/signup.js

import fs from "fs";
import path from "path";
import crypto from "crypto";

export default function signupRoute(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "username and password required"
      });
    }

    const authPath = path.join(process.cwd(), "auth.json");

    const users = fs.existsSync(authPath)
      ? JSON.parse(fs.readFileSync(authPath, "utf8"))
      : {};

    if (users[username]) {
      return res.status(400).json({
        error: "username already exists"
      });
    }

    const passwordHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    users[username] = {
      password: passwordHash,
      token: null
    };

    fs.writeFileSync(authPath, JSON.stringify(users, null, 2));

    res.json({
      success: true,
      message: "Account created successfully"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
