import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import crypto from "crypto";

function generateRecoveryCodes(count = 8) {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString("hex")
  );
}

async function hashCodes(codes) {
  return Promise.all(
    codes.map(async (code) => ({
      hash: await bcrypt.hash(code, 10),
      used: false
    }))
  );
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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

function saveUsers(users) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(users, null, 2));
}

export default async function signupRoute(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "username and password required"
      });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        error: "password must be at least 8 characters with uppercase, lowercase, number, and special character"
      });
    }

    const users = loadUsers();

    if (users[username]) {
      return res.status(400).json({
        error: "username already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const rawCodes = generateRecoveryCodes();
    const recoveryCodes = await hashCodes(rawCodes);

    users[username] = {
      passwordHash,
      recoveryCodes
    };

    saveUsers(users);

    res.json({
      message: "Account created successfully",
      codes: rawCodes
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}