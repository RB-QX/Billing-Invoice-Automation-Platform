import { useState } from 'react';

export default function InvoiceButton() {
  const [format, setFormat] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/invoice/generate`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format })
    });
    const data = await res.json();
    setLoading(false);
    if (data.invoiceUrl) window.open(`${import.meta.env.VITE_API_BASE}${data.invoiceUrl}`, '_blank');
  };

  return (
    <div className="flex gap-4 flex-wrap">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as 'light' | 'dark')}
        className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-200"
      >
        <option value="light">Light Invoice</option>
        <option value="dark">Dark Invoice</option>
      </select>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow transition disabled:opacity-50"
      >
        {loading ? "Generating..." : "🧾 Generate Invoice"}
      </button>
    </div>
  );
}
