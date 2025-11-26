import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import customerRoutes from "./routes/customer.js";
import bankerRoutes from "./routes/banker.js";

const app = express();
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV === "production") {
      console.log("[CORS] incoming origin:", origin, "expected:", FRONTEND_URL);
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

app.options("/*", cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/banker", bankerRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && (err.stack || err));
  const status = err && err.status ? err.status : 500;
  res.status(status).json({ message: err?.message || "Internal Server Error" });
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
