import express from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { zapierLogs } from "../mock/data.js";

const router = express.Router();

router.get("/", requireAuth, (_req, res) => {
  res.json(zapierLogs.slice(0, 10)); // show last 10
});

export default router;
