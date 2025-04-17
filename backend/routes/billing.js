import express from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { billingData } from "../mock/data.js";

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  const email = req.user.emails[0].value;
  const data = billingData[email];
  if (!data) return res.status(404).json({ error: "No billing data" });
  res.json(data);
});

export default router;
