"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  LogOut,
  Send,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  DollarSign,
  CreditCard,
  Smartphone,
  Shield,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Wallet,
  Settings,
  History,
  RefreshCw
} from "lucide-react";

interface Transaction {
  id: string;
  type: "send" | "receive" | "deposit" | "withdrawal";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  recipient?: string;
  sender?: string;
  fee?: number;
}

interface UserProfile {
  name: string;
  email: string;
  accountNumber: string;
  balance: number;
  availableBalance: number;
  pendingBalance: number;
  totalIncome: number;
  totalExpenses: number;
  memberSince: string;
  accountType: string;
  verificationStatus: "verified" | "pending" | "unverified";
}

interface PortfolioItem {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  change24h: number;
  changePercent: number;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "receive",
    amount: 250.00,
    description: "Payment from John Doe",
    date: "2024-01-15T10:30:00Z",
    status: "completed",
    sender: "John Doe",
    fee: 0.50
  },
  {
    id: "2",
    type: "send",
    amount: -75.50,
    description: "Coffee & Lunch",
    date: "2024-01-15T08:45:00Z",
    status: "completed",
    recipient: "Starbucks",
    fee: 1.25
  },
  {
    id: "3",
    type: "deposit",
    amount: 1000.00,
    description: "Bank Transfer Deposit",
    date: "2024-01-14T14:20:00Z",
    status: "completed",
    fee: 2.00
  },
  {
    id: "4",
    type: "send",
    amount: -120.00,
    description: "Utility Bill Payment",
    date: "2024-01-14T11:15:00Z",
    status: "completed",
    recipient: "Electric Company",
    fee: 0.75
  },
  {
    id: "5",
    type: "receive",
    amount: 500.00,
    description: "Freelance Payment",
    date: "2024-01-13T16:30:00Z",
    status: "completed",
    sender: "ABC Corp",
    fee: 0.00
  },
  {
    id: "6",
    type: "withdrawal",
    amount: -200.00,
    description: "ATM Withdrawal",
    date: "2024-01-12T15:20:00Z",
    status: "completed",
    fee: 3.00
  }
];

const mockUserProfile: UserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  accountNumber: "****1234",
  balance: 2847.25,
  availableBalance: 2800.00,
  pendingBalance: 47.25,
  totalIncome: 4750.00,
  totalExpenses: 1902.75,
  memberSince: "March 2023",
  accountType: "Premium",
  verificationStatus: "verified"
};

const mockPortfolio: PortfolioItem[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    amount: 0.05832,
    value: 1247.83,
    change24h: 45.32,
    changePercent: 3.77
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: 1.2543,
    value: 832.41,
    change24h: -12.45,
    changePercent: -1.47
  },
  {
    symbol: "USD",
    name: "US Dollar",
    amount: 2847.25,
    value: 2847.25,
    change24h: 0.00,
    changePercent: 0.00
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [userProfile] = useState<UserProfile>(mockUserProfile);
  const [portfolio] = useState<PortfolioItem[]>(mockPortfolio);

  const handleSignOut = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push("/");
    setIsLoading(false);
  };

  const navigateToPage = (path: string) => {
    router.push(path);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "receive":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case "send":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case "deposit":
        return <Plus className="h-4 w-4 text-blue-600" />;
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-orange-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const totalPortfolioValue = portfolio.reduce((sum, item) => sum + item.value, 0);
  const portfolioChange24h = portfolio.reduce((sum, item) => sum + item.change24h, 0);
  const portfolioChangePercent = totalPortfolioValue > 0 ? (portfolioChange24h / totalPortfolioValue) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Balance Card */}
                <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#7CB342] to-[#8DB859] text-white pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold">Available Balance</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBalanceVisible(!balanceVisible)}
                        className="text-white hover:bg-white/20"
                      >
                        {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900 mb-1">
                        {balanceVisible ? formatCurrency(userProfile.availableBalance) : "••••••••"}
                      </p>
                      <p className="text-sm text-gray-600">Ready to spend</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Balance */}
                <Card className="bg-white shadow-lg border-0 rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-orange-500" />
                      Pending
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600 mb-1">
                        {balanceVisible ? formatCurrency(userProfile.pendingBalance) : "••••"}
                      </p>
                      <p className="text-sm text-gray-600">Processing</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Summary */}
                <Card className="bg-white shadow-lg border-0 rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                      This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Income</span>
                        <span className="text-sm font-semibold text-green-600">+$1,250</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Expenses</span>
                        <span className="text-sm font-semibold text-red-600">-$485</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-900">Net</span>
                          <span className="text-sm font-bold text-blue-600">+$765</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Portfolio Overview */}
              <Card className="bg-white shadow-lg border-0 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-[#7CB342]" />
                    Portfolio Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolio.map((item) => (
                      <div
                        key={item.symbol}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#7CB342] to-[#8DB859] rounded-full">
                            <span className="text-white font-bold text-sm">{item.symbol}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              {item.symbol !== "USD" ? `${item.amount.toFixed(6)} ${item.symbol}` : `${item.amount.toLocaleString()} ${item.symbol}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(item.value)}
                          </p>
                          <p className={`text-sm flex items-center justify-end ${
                            item.change24h >= 0 ? "text-green-600" : "text-red-600"
                          }`}>
                            {item.change24h >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                            {item.changePercent.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white shadow-lg border-0 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      onClick={() => navigateToPage("/dashboard/send")}
                      className="h-20 bg-gradient-to-r from-[#7CB342] to-[#8DB859] hover:from-[#6BA237] hover:to-[#7CA751] text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2"
                    >
                      <Send className="h-6 w-6" />
                      <span className="text-sm font-medium">Send</span>
                    </Button>
                    <Button
                      onClick={() => navigateToPage("/dashboard/receive")}
                      className="h-20 bg-gradient-to-r from-[#8DB859] to-[#A5C663] hover:from-[#7CA751] hover:to-[#94B556] text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2"
                    >
                      <Download className="h-6 w-6" />
                      <span className="text-sm font-medium">Receive</span>
                    </Button>
                    <Button
                      onClick={() => navigateToPage("/dashboard/add-funds")}
                      className="h-20 bg-gradient-to-r from-[#A5C663] to-[#7CB342] hover:from-[#94B556] hover:to-[#6BA237] text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2"
                    >
                      <Plus className="h-6 w-6" />
                      <span className="text-sm font-medium">Add Funds</span>
                    </Button>
                    <Button
                      onClick={() => navigateToPage("/dashboard/history")}
                      className="h-20 bg-gradient-to-r from-[#7CB342] to-[#A5C663] hover:from-[#6BA237] hover:to-[#94B556] text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2"
                    >
                      <History className="h-6 w-6" />
                      <span className="text-sm font-medium">History</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="bg-white shadow-lg border-0 rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-[#7CB342]" />
                    Recent Activity
                  </CardTitle>
                  <Button
                    onClick={() => navigateToPage("/dashboard/history")}
                    variant="outline"
                    size="sm"
                    className="text-[#7CB342] border-[#7CB342] hover:bg-[#7CB342]/10"
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                            {transaction.recipient && (
                              <p className="text-xs text-gray-500">To: {transaction.recipient}</p>
                            )}
                            {transaction.sender && (
                              <p className="text-xs text-gray-500">From: {transaction.sender}</p>
                            )}
                            {transaction.fee && transaction.fee > 0 && (
                              <p className="text-xs text-gray-500">Fee: {formatCurrency(transaction.fee)}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.amount > 0 ? "text-green-600" : "text-red-600"
                          }`}>
                            {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Overview */}
              <Card className="bg-white shadow-lg border-0 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-[#7CB342]" />
                    Account Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Account Holder</p>
                        <p className="font-medium text-gray-900">{userProfile.name}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      userProfile.verificationStatus === "verified"
                        ? "bg-green-100 text-green-800"
                        : userProfile.verificationStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {userProfile.verificationStatus}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p className="font-medium text-gray-900">{userProfile.accountNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{userProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Account Type</p>
                      <p className="font-medium text-gray-900">{userProfile.accountType}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900">{userProfile.memberSince}</p>
                  </div>
                  
                  <Button
                    onClick={() => navigateToPage("/dashboard/settings")}
                    variant="outline"
                    className="w-full mt-4 border-[#7CB342] text-[#7CB342] hover:bg-[#7CB342]/10"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Stats */}
              <Card className="bg-white shadow-lg border-0 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-[#7CB342]" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Total Income</span>
                    </div>
                    <span className="text-sm font-bold text-green-800">
                      {formatCurrency(userProfile.totalIncome)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <ArrowUpRight className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Total Expenses</span>
                    </div>
                    <span className="text-sm font-bold text-red-800">
                      {formatCurrency(userProfile.totalExpenses)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Net Worth</span>
                    </div>
                    <span className="text-sm font-bold text-blue-800">
                      {formatCurrency(userProfile.totalIncome - userProfile.totalExpenses)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Portfolio Change</span>
                    </div>
                    <span className={`text-sm font-bold ${
                      portfolioChange24h >= 0 ? "text-green-800" : "text-red-800"
                    }`}>
                      {portfolioChange24h >= 0 ? "+" : ""}{formatCurrency(portfolioChange24h)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="bg-white shadow-lg border-0 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => navigateToPage("/dashboard/send")}
                    variant="ghost"
                    className="w-full justify-start text-left p-3 hover:bg-gray-50"
                  >
                    <Send className="h-4 w-4 mr-3 text-[#7CB342]" />
                    Send Money
                  </Button>
                  <Button
                    onClick={() => navigateToPage("/dashboard/receive")}
                    variant="ghost"
                    className="w-full justify-start text-left p-3 hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-3 text-[#7CB342]" />
                    Receive Funds
                  </Button>
                  <Button
                    onClick={() => navigateToPage("/dashboard/add-funds")}
                    variant="ghost"
                    className="w-full justify-start text-left p-3 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-3 text-[#7CB342]" />
                    Add Funds
                  </Button>
                  <Button
                    onClick={() => navigateToPage("/dashboard/history")}
                    variant="ghost"
                    className="w-full justify-start text-left p-3 hover:bg-gray-50"
                  >
                    <History className="h-4 w-4 mr-3 text-[#7CB342]" />
                    Transaction History
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="ghost"
                    className="w-full justify-start text-left p-3 hover:bg-gray-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-3 text-[#7CB342]" />
                    Refresh Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}