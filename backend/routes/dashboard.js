// routes/dashboard.js
import express from "express";
const router = express.Router();

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
};

// Dashboard route
router.get("/", isAuthenticated, (req, res) => {
  res.json({
    message: "Dashboard data retrieved successfully",
    user: req.user
  });
});

export default router;