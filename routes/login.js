import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AUTH_FILE = path.join(process.cwd(), "auth.json");


function loadUsers() {
  if (!fs.existsSync(AUTH_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(AUTH_FILE, "utf8"));
  } catch {
    console.error("auth.json corrupted");
    return {};
  }
}

export default async function loginRoute(req, res) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "username and password required"
      });
    }
    
    if (!username?.trim() || !password || username.length > 255 || password.length > 1024) {
      return res.status(400).json({ error: "invalid input" });
    }

    const users = loadUsers();
    const user = users[username];

    if (!user) {
      return res.status(401).json({
        error: "invalid username or password"
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        error: "invalid username or password"
      });
    }

    const token = jwt.sign(
      { username },
      JWT_SECRET,
      { expiresIn: "90d" }
    );

    res.json({
      message: "Login successful",
      token
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}