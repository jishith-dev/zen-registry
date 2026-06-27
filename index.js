import express from "express";

import publishRoute from "./routes/publish.js";
import unPublishRoute from "./routes/unpublish.js";
import registryRoute from "./routes/registry.js";
import listRoute from "./routes/list.js";
import signupRoute from "./routes/signup.js";
import loginRoute from "./routes/login.js";

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET environment variable is not set");
  process.exit(1);
}

// Authentication
app.post("/api/signup", signupRoute);
app.post("/api/login", loginRoute);

// Registry
app.get("/api/packages.json", registryRoute);
app.get("/api/list", listRoute);

// Package management
app.post("/api/publish", publishRoute);
app.delete("/api/unpublish", unPublishRoute);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal server error"
  });
});

app.listen(3000, () => {
  console.log("Server running on :3000");
});
