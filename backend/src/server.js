import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import customerRoutes from "./routes/customer.js";
import bankerRoutes from "./routes/banker.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); 
    if (process.env.NODE_ENV === "production") {
      console.log("[CORS] incoming origin:", origin);

      if (origin === FRONTEND_URL) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    }

    return callback(null, true); 
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("/*splat", cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/banker", bankerRoutes);

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "frontend", "dist");

  console.log("[Production] Serving static files from:", distPath);

  app.use(express.static(distPath));

  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err?.stack || err);
  res.status(500).json({ message: err?.message || "Internal Server Error" });
});

const PORT = parseInt(process.env.PORT, 10) || 4000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("App failed to start:", err);
    process.exit(1);
  }
})();
