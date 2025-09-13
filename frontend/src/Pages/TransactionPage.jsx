/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { 
  ArrowDown, 
  ArrowUp, 
  Filter, 
  Calendar, 
  Download, 
  Search, 
  CreditCard, 
  Coins, 
  TrendingUp,
  Clock,
  Check,
  X
} from "lucide-react";
import { useAuthStore } from "../Stores/useAuthStore";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuyTokens, setShowBuyTokens] = useState(false);
  const [filters, setFilters] = useState({
    type: "all", // all, credit, debit
    limit: "all", // all, 10, 25, 50
    dateRange: "all", // all, week, month, 3months
    search: ""
  });
  
  const { authUser, checkAuth } = useAuthStore();

  // Token packages
  const tokenPackages = [
    {
      id: 1,
      tokens: 1000,
      price: 100,
      popular: false,
      savings: null
    },
    {
      id: 2,
      tokens: 2500,
      price: 200,
      popular: true,
      savings: "25% more tokens"
    },
    {
      id: 3,
      tokens: 5000,
      price: 350,
      popular: false,
      savings: "43% more tokens"
    },
    {
      id: 4,
      tokens: 10000,
      price: 600,
      popular: false,
      savings: "67% more tokens"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      await checkAuth();
      const txnData = authUser?.tokenHistory || [];
      setTransactions(txnData);
      setFilteredTransactions(txnData);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter transactions based on current filters
  useEffect(() => {
    let filtered = [...transactions];

    // Type filter
    if (filters.type !== "all") {
      filtered = filtered.filter(txn => txn.type === filters.type);
    }

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(txn => 
        (txn.reason || "").toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "3months":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(txn => new Date(txn.date) >= cutoffDate);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Limit filter (apply after sorting)
    if (filters.limit !== "all") {
      filtered = filtered.slice(0, parseInt(filters.limit));
    }

    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTransactionIcon = (type) => {
    return type === "credit" ? (
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <ArrowUp className="w-5 h-5 text-green-600" />
      </div>
    ) : (
      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
        <ArrowDown className="w-5 h-5 text-red-600" />
      </div>
    );
  };

  const handleBuyTokens = (packageId) => {
    // Placeholder function - implement actual purchase logic
    console.log(`Purchasing token package ${packageId}`);
  };

  const exportTransactions = () => {
    // Placeholder function - implement CSV export
    console.log("Exporting transactions...");
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-600 mt-1">Manage your tokens and view transaction details</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBuyTokens(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Coins className="w-4 h-4" />
              Buy Tokens
            </button>
            <button
              onClick={exportTransactions}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-2xl font-bold text-gray-900">{authUser?.tokens || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            {/* Search */}
            <div className="relative min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="Credit">Credits</option>
              <option value="Deduct">Debits</option>
            </select>
            
            {/* Date Range Filter */}
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
            </select>
            
            {/* Limit Filter */}
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange("limit", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Show All</option>
              <option value="10">Last 10</option>
              <option value="25">Last 25</option>
              <option value="50">Last 50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Transactions ({filteredTransactions.length})
          </h2>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No transactions found matching your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((txn, index) => (
              <div key={txn._id || index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getTransactionIcon(txn.type)}
                    <div>
                      <p className="font-medium text-gray-900">
                        {txn.type === "credit" ? "Token Purchase" : txn.reason || "Token Usage"}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-500">{formatDate(txn.date)}</p>
                        <p className="text-sm text-gray-500">{formatTime(txn.date)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                      {txn.type === "credit" ? "+" : "-"}{txn.amount} tokens
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buy Tokens Modal */}
      {showBuyTokens && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Buy Tokens</h2>
                <button
                  onClick={() => setShowBuyTokens(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">Choose the perfect token package for your needs</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tokenPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                      pkg.popular 
                        ? "border-indigo-500 bg-indigo-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleBuyTokens(pkg.id)}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Coins className="w-8 h-8 text-indigo-600" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {pkg.tokens.toLocaleString()} Tokens
                      </h3>
                      
                      <div className="text-3xl font-bold text-indigo-600 mb-2">
                        ₹{pkg.price}
                      </div>
                      
                      {pkg.savings && (
                        <div className="text-sm text-green-600 font-medium mb-4">
                          {pkg.savings}
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-500 mb-6">
                        ₹{(pkg.price / pkg.tokens).toFixed(3)} per token
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyTokens(pkg.id);
                        }}
                        className={`w-full py-3 rounded-lg font-medium transition-colors ${
                          pkg.popular
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-gray-900 hover:bg-gray-800 text-white"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Purchase Now
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Secure Payment</h4>
                    <p className="text-sm text-blue-700">
                      All transactions are encrypted and secure. Tokens are added to your account instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;