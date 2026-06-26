import express from "express";
import publishRoute from "./routes/publish.js";
import registryRoute from "./routes/registry.js";

const app = express();
app.use(express.json());

app.post("/api/publish", publishRoute);
app.get("/api/packages.json", registryRoute);

app.listen(3000, () => console.log("Server running on :3000"));
