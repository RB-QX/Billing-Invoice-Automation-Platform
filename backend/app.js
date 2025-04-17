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

import { usageData } from "./mock/data.js"; // import your in-memory data

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// disable caching (no 304s)
app.disable("etag");
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, max-age=0");
  next();
});

// CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

app.use(session({
  secret: process.env.SESSION_SECRET || "default_session_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000, sameSite: "lax", secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// your existing routes
app.use("/auth", authRoute);
app.use("/api/usage", usageRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/invoices", express.static(path.join(__dirname, "invoices")));

app.get("/", (req, res) => res.send("API is running 🚀"));
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// create HTTP server and attach Socket.IO
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: "http://localhost:5173", credentials: true }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

// broadcast usageData every 5 seconds
setInterval(() => {
  Object.entries(usageData).forEach(([email, usage]) => {
    io.emit("usageUpdate", { email, usage });
  });
}, 5000);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server (with Socket.IO) started on port ${PORT}`));
