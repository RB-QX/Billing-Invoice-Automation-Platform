import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import axios from "axios";
import requireAuth from "../middlewares/requireAuth.js";
import { billingData } from "../mock/data.js";

const router = express.Router();

// Fix for ES modules: recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/generate", requireAuth, async (req, res) => {
  try {
    const {
      format = "light",
      companyName = "My Company",
      invoiceNumber = "0001",
    } = req.body;

    const email = req.user.emails[0].value;
    const billing = billingData[email];
    if (!billing) {
      return res.status(404).json({ error: "No billing data for user" });
    }

    // Ensure invoices directory exists
    const invoicesDir = path.join(__dirname, "..", "invoices");
    if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir);

    // Build file path
    const fileName = `invoice_${email.replace(/[@.]/g, "_")}_${Date.now()}.pdf`;
    const filePath = path.join(invoicesDir, fileName);

    // Create PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Theme background/text
    if (format === "dark") {
      doc.rect(0, 0, doc.page.width, doc.page.height).fill("#1a202c");
      doc.fillColor("#edf2f7");
    } else {
      doc.fillColor("#1a202c");
    }

    // Header: Company & Invoice #
    doc
      .fontSize(18)
      .text(companyName, { align: "left" })
      .fontSize(12)
      .text(`Invoice #: ${invoiceNumber}`, { align: "right" })
      .moveDown(2);

    // Title
    doc.fontSize(20).text("Billing Invoice", { align: "center" }).moveDown();

    // Billing details
    doc
      .fontSize(12)
      .text(`Email: ${email}`)
      .text(`Period: ${billing.currentCycleStart} – ${billing.currentCycleEnd}`)
      .text(`Usage: ${billing.cycleUsage}`)
      .text(`Amount Due: ${billing.billingAmount}`)
      .moveDown(2);

    // Footer timestamp
    doc
      .fontSize(10)
      .text(`Generated on ${new Date().toLocaleString()}`, { align: "right" });

    doc.end();

    stream.on("finish", () => {
      // Trigger Zapier webhook
      axios
        .post(process.env.ZAPIER_HOOK_URL, {
          email,
          amount: billing.billingAmount,
          period: `${billing.currentCycleStart}–${billing.currentCycleEnd}`,
          companyName,
          invoiceNumber,
        })
        .catch(() => {});

      // Respond with URL
      res.json({ invoiceUrl: `/invoices/${fileName}` });
    });
  } catch (err) {
    console.error("Invoice generation failed:", err);
    res
      .status(500)
      .json({ error: "Invoice generation failed", details: err.message });
  }
});

export default router;
