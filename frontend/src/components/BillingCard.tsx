type Props = {
  billing: {
    currentCycleStart: string;
    currentCycleEnd: string;
    cycleUsage: string;
    billingAmount: string;
  };
};

export default function BillingCard({ billing }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
      <h2 className="text-xl font-bold text-green-600 mb-4">💰 Billing Info</h2>
      <ul className="text-gray-700 space-y-2">
        <li><strong>Cycle:</strong> {billing.currentCycleStart} – {billing.currentCycleEnd}</li>
        <li><strong>Usage:</strong> {billing.cycleUsage}</li>
        <li><strong>Amount:</strong> {billing.billingAmount}</li>
      </ul>
    </div>
  );
}
