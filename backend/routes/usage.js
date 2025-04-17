import express from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { usageData } from "../mock/data.js";

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  const email = req.user.emails[0].value;
  const data = usageData[email];
  if (!data) return res.status(404).json({ error: "No usage data" });
  res.json(data);
});

export default router;
