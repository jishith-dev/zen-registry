import { sql } from "../db.js";
import bcrypt from "bcryptjs";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default async function recoveryRoute(req, res) {
  try {
    const { username, recoveryCode, newPassword } = req.body;

    if (!username || !recoveryCode || !newPassword) {
      return res.status(400).json({
        error: "username, recovery code, and new password required"
      });
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        error: "password must be at least 8 characters with uppercase, lowercase, number, and special character"
      });
    }

    const rows = await sql`SELECT * FROM users WHERE username = ${username}`;
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        error: "user not found"
      });
    }

    let validCode = false;
    let codeIndex = -1;
    const codes = user.recovery_codes;

    for (let i = 0; i < codes.length; i++) {
      if (!codes[i].used) {
        const match = await bcrypt.compare(recoveryCode, codes[i].hash);
        if (match) {
          validCode = true;
          codeIndex = i;
          break;
        }
      }
    }

    if (!validCode) {
      return res.status(401).json({
        error: "invalid or used recovery code"
      });
    }

    codes[codeIndex].used = true;
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    
    await sql`
  UPDATE users 
  SET password_hash = ${newPasswordHash}, recovery_codes = ${codes}
  WHERE username = ${username}
`;

    res.json({
      message: "Password reset successfully"
    });
  } catch (err) {
    console.error("Recovery error:", err);
    res.status(500).json({
      error: "recovery failed"
    });
  }
}