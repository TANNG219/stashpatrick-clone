"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  EyeOff
} from "lucide-react";

interface Transaction {
  id: string;
  type: "send" | "receive" | "deposit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  recipient?: string;
  sender?: string;
}

interface UserProfile {
  name: string;
  email: string;
  accountNumber: string;
  balance: number;
  memberSince: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "receive",
    amount: 250.00,
    description: "Payment from John Doe",
    date: "2024-01-15T10:30:00Z",
    status: "completed",
    sender: "John Doe"
  },
  {
    id: "2",
    type: "send",
    amount: -75.50,
    description: "Coffee & Lunch",
    date: "2024-01-15T08:45:00Z",
    status: "completed",
    recipient: "Starbucks"
  },
  {
    id: "3",
    type: "deposit",
    amount: 1000.00,
    description: "Bank Transfer Deposit",
    date: "2024-01-14T14:20:00Z",
    status: "completed"
  },
  {
    id: "4",
    type: "send",
    amount: -120.00,
    description: "Utility Bill Payment",
    date: "2024-01-14T11:15:00Z",
    status: "completed",
    recipient: "Electric Company"
  },
  {
    id: "5",
    type: "receive",
    amount: 500.00,
    description: "Freelance Payment",
    date: "2024-01-13T16:30:00Z",
    status: "completed",
    sender: "ABC Corp"
  }
];

const mockUserProfile: UserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  accountNumber: "****1234",
  balance: 2847.25,
  memberSince: "March 2023"
};

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [userProfile] = useState<UserProfile>(mockUserProfile);

  const handleSignOut = async () => {
    setIsLoading(true);
    // Simulate sign out
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push("/");
    setIsLoading(false);
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
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A5C663] to-[#8DB859]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Welcome back, {userProfile.name}
                </h2>
                <p className="text-sm text-white/80">
                  {new Date().toLocaleDateString("en-US", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white/80">Total Balance</p>
                <p className="text-xl font-bold text-white">
                  {balanceVisible ? formatCurrency(userProfile.balance) : "••••••"}
                </p>
              </div>
              <Button
                onClick={handleSignOut}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoading ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#7CB342] to-[#8DB859] text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">Wallet Balance</CardTitle>
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
              <CardContent className="p-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {balanceVisible ? formatCurrency(userProfile.balance) : "••••••••"}
                  </p>
                  <p className="text-gray-600">Available Balance</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white shadow-lg border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button
                    className="h-20 bg-gradient-to-r from-[#7CB342] to-[#8DB859] hover:from-[#6BA237] hover:to-[#7CA751] text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2"
                  >
                    <Send className="h-6 w-6" />
                    <span className="text-sm font-medium">Send Money</span>
                  </Button>
                  <Button
                    className="h-20 bg-gradient-to-r from-[#8DB859] to-[#A5C663] hover:from-[#7CA751] hover:to-[#94B556] text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2"
                  >
                    <Download className="h-6 w-6" />
                    <span className="text-sm font-medium">Receive</span>
                  </Button>
                  <Button
                    className="h-20 bg-gradient-to-r from-[#A5C663] to-[#7CB342] hover:from-[#94B556] hover:to-[#6BA237] text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2"
                  >
                    <Plus className="h-6 w-6" />
                    <span className="text-sm font-medium">Add Funds</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="bg-white shadow-lg border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-[#7CB342]" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
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
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Account Holder</p>
                    <p className="font-medium text-gray-900">{userProfile.name}</p>
                  </div>
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
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium text-gray-900">{userProfile.memberSince}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white shadow-lg border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Received</span>
                  </div>
                  <span className="text-sm font-bold text-green-800">+$750.00</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Sent</span>
                  </div>
                  <span className="text-sm font-bold text-red-800">-$195.50</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Plus className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Deposits</span>
                  </div>
                  <span className="text-sm font-bold text-blue-800">+$1,000.00</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}