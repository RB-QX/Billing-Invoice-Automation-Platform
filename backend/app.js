import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import path from "path";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { fileURLToPath } from "url";

import authRoute from "./routes/auth.js";
import usageRoutes from "./routes/usage.js";
import billingRoutes from "./routes/billing.js";
import invoiceRoutes from "./routes/invoice.js";
import "./services/passport.js";
import { usageData } from "./mock/data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── Disable ETag & Caching ──────────────────────────────────────────────
app.disable("etag");
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, max-age=0");
  next();
});

// ── CORS & JSON Parsing & Logging ───────────────────────────────────────
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET","POST","OPTIONS"]
}));
app.use(express.json());
app.use(morgan("dev"));

// ── Session & Passport ──────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || "default_session_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000, sameSite: "lax", secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// ── REST Routes ─────────────────────────────────────────────────────────
app.use("/auth", authRoute);
app.use("/api/usage", usageRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/invoices", express.static(path.join(__dirname, "invoices")));

app.get("/", (req, res) => res.send("API is running 🚀"));
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// ── Socket.IO Setup ────────────────────────────────────────────────────
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: "http://localhost:5173", credentials: true }
});

io.on("connection", socket => {
  console.log("🟢 WS client connected:", socket.id);
});

// ── Mutate & Broadcast Usage Every 5s ──────────────────────────────────
setInterval(() => {
  Object.entries(usageData).forEach(([email, usage]) => {
    const inc = Math.floor(Math.random() * 10) + 1;
    usage.apiCallsThisMonth += inc;
    usage.totalApiCalls    += inc;
    usage.storageUsedGB     = +(usage.storageUsedGB + Math.random() * 0.1).toFixed(2);
    io.emit("usageUpdate", { email, usage });
  });
}, 5000);

// ── Start HTTP + WS Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () =>
  console.log(`📡 Server + Socket.IO listening on port ${PORT}`)
);
