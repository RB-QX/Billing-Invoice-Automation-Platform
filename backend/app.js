// Simple Express server for Billing-Invoice-Automation-Platform

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "cookie-session";
import passport from "passport";

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Session middleware
app.use(session({
  name: "session",
  keys: ["key1", "key2"]
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Basic route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});