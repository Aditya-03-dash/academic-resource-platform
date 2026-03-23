const express  = require("express");
const cors     = require("cors");
const dotenv   = require("dotenv");
const helmet   = require("helmet");
const path     = require("path");
const rateLimit = require("express-rate-limit");

dotenv.config();

const connectDB         = require("./db");
const userRoutes        = require("./routes/userRoutes");
const authRoutes        = require("./routes/authRoutes");
const resourceRoutes    = require("./routes/resourceRoutes");
const messageRoutes     = require("./routes/messageRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// ── Security ──────────────────────────────────────────────────────────────
app.use(helmet({
  // Allow cross-origin resource policy so the React dev server can fetch uploads
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});
app.use(limiter);

// ── CORS ──────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// ── Static files (uploaded resources) ────────────────────────────────────
// Files saved by multer land in /uploads; expose them publicly for download
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ────────────────────────────────────────────────────────────────
app.use("/api/users",     userRoutes);
app.use("/api/auth",      authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/messages",  messageRoutes);   // ← was missing!

app.get("/", (req, res) => {
  res.json({ message: "Academic Resource API Running", status: "ok" });
});

// ── Global error handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

module.exports = app;