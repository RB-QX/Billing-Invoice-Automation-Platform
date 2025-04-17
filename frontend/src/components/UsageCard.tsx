type Props = {
  usage: {
    apiCallsThisMonth: number;
    totalApiCalls: number;
    storageUsedGB: number;
  };
};

export default function UsageCard({ usage }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
      <h2 className="text-xl font-bold text-blue-600 mb-4">📊 Usage Summary</h2>
      <ul className="text-gray-700 space-y-2">
        <li><strong>This Month:</strong> {usage.apiCallsThisMonth}</li>
        <li><strong>Total Calls:</strong> {usage.totalApiCalls}</li>
        <li><strong>Storage:</strong> {usage.storageUsedGB} GB</li>
      </ul>
    </div>
  );
}
