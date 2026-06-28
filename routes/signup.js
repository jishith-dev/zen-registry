import { sql } from "../db.js";
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

    const existing = await sql`SELECT 1 FROM users WHERE username = ${username}`;

    if (existing.length > 0) {
      return res.status(400).json({
        error: "username already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const rawCodes = generateRecoveryCodes();
    const recoveryCodes = await hashCodes(rawCodes);

    // Correct:
await sql`
  INSERT INTO users (username, password_hash, recovery_codes)
  VALUES (${username}, ${passwordHash}, ${recoveryCodes})
`;

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