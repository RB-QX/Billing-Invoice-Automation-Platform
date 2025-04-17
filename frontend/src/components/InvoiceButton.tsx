// frontend/src/components/InvoiceButton.tsx

import { useState } from "react";

interface InvoiceButtonProps {
  apiBase: string;
  userLoaded: boolean;
}

export default function InvoiceButton({
  apiBase,
  userLoaded,
}: InvoiceButtonProps) {
  const [companyName, setCompanyName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [format, setFormat] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(false);

  const generateInvoice = async () => {
    if (!companyName.trim() || !invoiceNumber.trim()) {
      return alert("Please enter both Company Name and Invoice Number.");
    }
    if (!userLoaded) {
      return alert("Your session is not ready yet—please wait.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/invoice/generate`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, invoiceNumber, format }),
      });

      if (res.status === 401) {
        throw new Error("Not authenticated – please log in again.");
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.details || "Server error");
      }

      window.open(`${apiBase}${data.invoiceUrl}`, "_blank");
    } catch (err: any) {
      console.error("Invoice generation error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
      />

      <input
        type="text"
        placeholder="Invoice Number"
        value={invoiceNumber}
        onChange={(e) => setInvoiceNumber(e.target.value)}
        className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
      />

      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as "light" | "dark")}
        className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
      >
        <option value="light">Light Theme</option>
        <option value="dark">Dark Theme</option>
      </select>

      <button
        onClick={generateInvoice}
        disabled={!userLoaded || loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow transition disabled:opacity-50"
      >
        {loading ? "Generating…" : "🧾 Generate Invoice"}
      </button>
    </div>
  );
}
