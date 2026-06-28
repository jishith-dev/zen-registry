import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const AUTH_FILE = path.join(process.cwd(), "auth.json");
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

    const users = loadUsers();
    const user = users[username];

    if (!user) {
      return res.status(401).json({
        error: "user not found"
      });
    }

    let validCode = false;
    let codeIndex = -1;

    for (let i = 0; i < user.recoveryCodes.length; i++) {
      if (!user.recoveryCodes[i].used) {
        const match = await bcrypt.compare(recoveryCode, user.recoveryCodes[i].hash);
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

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.recoveryCodes[codeIndex].used = true;

    saveUsers(users);

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