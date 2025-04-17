import express from "express";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import axios from "axios";
import requireAuth from "../middlewares/requireAuth.js";
import { billingData } from "../mock/data.js";

const router = express.Router();

router.post("/generate", requireAuth, async (req, res) => {
  const email = req.user.emails[0].value;
  const billing = billingData[email];
  if (!billing) return res.status(404).json({ error: "No billing data" });

  const fileName = `invoice_${email.replace(/[@.]/g, "_")}.pdf`;
  const filePath = path.join("invoices", fileName);

  // generate PDF
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));
  doc.fontSize(20).text("Billing Invoice", { align: "center" }).moveDown();
  doc.fontSize(14)
     .text(`Email: ${email}`)
     .text(`Period: ${billing.currentCycleStart} – ${billing.currentCycleEnd}`)
     .text(`Usage: ${billing.cycleUsage}`)
     .text(`Amount Due: ${billing.billingAmount}`)
     .text(`Date: ${new Date().toLocaleDateString()}`);
  doc.end();

  // fire Zapier webhook (async)
  axios.post(process.env.ZAPIER_HOOK_URL, {
    email, amount: billing.billingAmount, period: `${billing.currentCycleStart}–${billing.currentCycleEnd}`
  }).catch(console.error);

  res.json({ success: true, invoiceUrl: `/${filePath}` });
});

export default router;
