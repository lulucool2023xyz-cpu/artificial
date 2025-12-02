import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the SPA build
const spaPath = path.join(__dirname, "../spa");
app.use(express.static(spaPath));

// API routes can be added here
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Catch all handler: send back React's index.html file for SPA routing
// Must be last - catches all routes that don't match above
// Using app.use with no path to avoid path-to-regexp parsing issues with Express 5
app.use((req, res) => {
  res.sendFile(path.join(spaPath, "index.html"));
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving static files from: ${spaPath}`);
});

