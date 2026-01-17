interface TotalFundsRaisedCardProps {
  currentFund: number;
  targetFund: number | null;
}

export default function TotalFundsRaisedCard({
  currentFund,
  targetFund,
}: TotalFundsRaisedCardProps) {
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const calculateProgress = (current: number, target: number) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Total Funds Raised
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(currentFund)} raised
          </span>
          {targetFund && (
            <span className="text-sm text-gray-600">
              of {formatCurrency(targetFund)}
            </span>
          )}
        </div>
        {targetFund && (
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#56E0C2]"
              style={{
                width: `${calculateProgress(currentFund, targetFund)}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
