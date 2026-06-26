import express from "express";

import publishRoute from "./routes/publish.js";
import unPublishRoute from "./routes/unpublish.js";
import registryRoute from "./routes/registry.js";
import signupRoute from "./routes/signup.js";
import loginRoute from "./routes/login.js";

const app = express();

app.use(express.json());

// Authentication
app.post("/api/signup", signupRoute);
app.post("/api/login", loginRoute);

// Registry
app.get("/api/packages.json", registryRoute);

// Package management
app.post("/api/publish", publishRoute);
app.delete("/api/unpublish", unPublishRoute);

app.listen(3000, () => {
  console.log("Server running on :3000");
});
