import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoute from "./routes/auth.js";
import usageRoutes from "./routes/usage.js";
import billingRoutes from "./routes/billing.js";
import invoiceRoutes from "./routes/invoice.js";
import "./services/passport.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Disable ETag (no 304) and disable caching
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

// express-session setup
app.use(session({
  secret: process.env.SESSION_SECRET || "default_session_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: false
  }
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoute);
app.use("/api/usage", usageRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/invoice", invoiceRoutes);

// Serve invoice PDFs
app.use("/invoices", express.static(path.join(__dirname, "invoices")));

app.get("/", (req, res) => res.send("API is running 🚀"));
app.use((req, res) => res.status(404).json({ error: "Not found" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
