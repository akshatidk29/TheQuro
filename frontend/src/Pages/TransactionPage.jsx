import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useAuthStore } from "../Stores/useAuthStore";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      await checkAuth(); // make sure latest user data is fetched
      setTransactions(authUser?.tokenHistory || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

      {loading ? (
        <div className="text-center text-sm text-gray-500">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-sm text-gray-500">No transactions found.</div>
      ) : (
        <div className="space-y-4">
          {transactions
            .slice()
            .reverse()
            .map((txn, index) => (
              <div
                key={txn._id || index}
                className="border rounded-lg p-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">
                    {txn.type === "credit"
                      ? "Token Purchase"
                      : txn.reason || "Token Usage"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(txn.date).toLocaleString()}
                  </p>
                </div>

                <div
                  className={`flex items-center text-sm font-semibold ${
                    txn.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {txn.type === "credit" ? (
                    <ArrowUp size={16} className="mr-1" />
                  ) : (
                    <ArrowDown size={16} className="mr-1" />
                  )}
                  {txn.amount} Tokens
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
