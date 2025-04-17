// frontend/src/components/ZapierLogCard.tsx

import { useEffect, useState } from "react";

type LogEntry = {
  timestamp: string;
  email: string;
  invoiceUrl: string;
  companyName: string;
  invoiceNumber: string;
};

export default function ZapierLogCard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/api/zapier/logs`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => r.json())
      .then(setLogs)
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
      <h2 className="text-xl font-bold text-purple-600 mb-4">Automation Log</h2>
      {logs.length === 0 ? (
        <p className="text-gray-500">No automations yet.</p>
      ) : (
        <ul className="space-y-2 text-gray-700 text-sm">
          {logs.map((entry, i) => (
            <li key={i} className="border-b pb-2">
              <div><strong>{entry.timestamp}</strong></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
