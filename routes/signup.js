import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const AUTH_FILE = path.join(process.cwd(), "auth.json");

function loadUsers() {
  return fs.existsSync(AUTH_FILE)
    ? JSON.parse(fs.readFileSync(AUTH_FILE, "utf8"))
    : {};
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

    users[username] = {
      passwordHash
    };

    saveUsers(users);

    res.json({
      message: "Account created successfully"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}