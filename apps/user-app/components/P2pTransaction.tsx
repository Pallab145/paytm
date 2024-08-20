import { Card } from "@repo/ui/card";

export const P2pTransaction = ({
  transactions,
}: {
  transactions: {
    amount: number;
    timestamp: Date;
  }[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="flex justify-center items-center h-24">
          <span className="text-gray-500">No Recent Transactions</span>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Recent Transactions">
      <div className="pt-4">
        {transactions.map((t, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-200"
          >
            <div>
              <div className="text-sm font-medium text-gray-700">
                Sent INR
              </div>
              <div className="text-xs text-gray-500">
                {t.timestamp.toDateString()}
              </div>
            </div>
            <div className="text-right text-green-600 font-semibold">
              + Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
