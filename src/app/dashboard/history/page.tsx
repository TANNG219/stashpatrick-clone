"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ArrowLeft, Search, Filter, Download, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Plus, Minus, Clock, CheckCircle, XCircle, Calendar, FileText, BarChart3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'deposit' | 'withdrawal';
  amount: number;
  currency: 'USD' | 'BTC' | 'ETH';
  status: 'completed' | 'pending' | 'failed';
  date: Date;
  recipient?: string;
  sender?: string;
  description: string;
  fee: number;
  hash?: string;
  category: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    type: 'receive',
    amount: 2500.00,
    currency: 'USD',
    status: 'completed',
    date: new Date('2024-01-15T10:30:00'),
    sender: 'Alice Johnson',
    description: 'Freelance payment',
    fee: 0,
    hash: '0x1a2b3c4d5e6f',
    category: 'Income'
  },
  {
    id: 'txn_002',
    type: 'send',
    amount: 0.05,
    currency: 'BTC',
    status: 'completed',
    date: new Date('2024-01-14T14:20:00'),
    recipient: 'Bob Smith',
    description: 'Bitcoin investment',
    fee: 0.001,
    hash: '0x9f8e7d6c5b4a',
    category: 'Investment'
  },
  {
    id: 'txn_003',
    type: 'deposit',
    amount: 1000.00,
    currency: 'USD',
    status: 'pending',
    date: new Date('2024-01-14T09:15:00'),
    description: 'Bank transfer deposit',
    fee: 0,
    category: 'Deposit'
  },
  {
    id: 'txn_004',
    type: 'withdrawal',
    amount: 500.00,
    currency: 'USD',
    status: 'failed',
    date: new Date('2024-01-13T16:45:00'),
    recipient: 'Chase Bank',
    description: 'ATM withdrawal',
    fee: 2.50,
    category: 'Withdrawal'
  },
  {
    id: 'txn_005',
    type: 'send',
    amount: 1.5,
    currency: 'ETH',
    status: 'completed',
    date: new Date('2024-01-12T11:30:00'),
    recipient: 'Carol Davis',
    description: 'DeFi staking',
    fee: 0.02,
    hash: '0x5a4b3c2d1e0f',
    category: 'DeFi'
  },
  {
    id: 'txn_006',
    type: 'receive',
    amount: 750.00,
    currency: 'USD',
    status: 'completed',
    date: new Date('2024-01-11T13:20:00'),
    sender: 'David Wilson',
    description: 'Refund payment',
    fee: 0,
    category: 'Refund'
  },
  {
    id: 'txn_007',
    type: 'send',
    amount: 200.00,
    currency: 'USD',
    status: 'completed',
    date: new Date('2024-01-10T08:45:00'),
    recipient: 'Emma Brown',
    description: 'Dinner split',
    fee: 1.50,
    category: 'Personal'
  },
  {
    id: 'txn_008',
    type: 'deposit',
    amount: 0.1,
    currency: 'BTC',
    status: 'completed',
    date: new Date('2024-01-09T15:30:00'),
    description: 'Mining reward',
    fee: 0,
    category: 'Mining'
  },
  {
    id: 'txn_009',
    type: 'withdrawal',
    amount: 300.00,
    currency: 'USD',
    status: 'completed',
    date: new Date('2024-01-08T12:15:00'),
    recipient: 'Wells Fargo',
    description: 'Bank withdrawal',
    fee: 5.00,
    category: 'Withdrawal'
  },
  {
    id: 'txn_010',
    type: 'send',
    amount: 2.0,
    currency: 'ETH',
    status: 'pending',
    date: new Date('2024-01-07T17:20:00'),
    recipient: 'Frank Miller',
    description: 'NFT purchase',
    fee: 0.05,
    category: 'NFT'
  },
  {
    id: 'txn_011',
    type: 'receive',
    amount: 1200.00,
    currency: 'USD',
    status: 'completed',
    date: new Date('2024-01-06T10:00:00'),
    sender: 'Grace Lee',
    description: 'Consulting fee',
    fee: 0,
    category: 'Income'
  },
  {
    id: 'txn_012',
    type: 'send',
    amount: 450.00,
    currency: 'USD',
    status: 'completed',
    date: new Date('2024-01-05T14:30:00'),
    recipient: 'Henry Garcia',
    description: 'Rent payment',
    fee: 0,
    category: 'Bills'
  },
  {
    id: 'txn_013',
    type: 'deposit',
    amount: 3.5,
    currency: 'ETH',
    status: 'completed',
    date: new Date('2023-12-28T09:45:00'),
    description: 'Exchange transfer',
    fee: 0.01,
    category: 'Transfer'
  },
  {
    id: 'txn_014',
    type: 'withdrawal',
    amount: 0.02,
    currency: 'BTC',
    status: 'failed',
    date: new Date('2023-12-25T16:20:00'),
    recipient: 'Coinbase',
    description: 'Exchange withdrawal',
    fee: 0.005,
    category: 'Exchange'
  },
  {
    id: 'txn_015',
    type: 'send',
    amount: 125.00,
    currency: 'USD',
    status: 'completed',
    date: new Date('2023-12-20T11:15:00'),
    recipient: 'Ivy Johnson',
    description: 'Gift payment',
    fee: 1.25,
    category: 'Gift'
  },
  {
    id: 'txn_016',
    type: 'receive',
    amount: 0.08,
    currency: 'BTC',
    status: 'completed',
    date: new Date('2023-12-18T13:40:00'),
    sender: 'Jack White',
    description: 'P2P trade',
    fee: 0,
    category: 'Trading'
  },
  {
    id: 'txn_017',
    type: 'deposit',
    amount: 800.00,
    currency: 'USD',
    status: 'completed',
    date: new Date('2023-12-15T08:20:00'),
    description: 'Salary deposit',
    fee: 0,
    category: 'Salary'
  },
  {
    id: 'txn_018',
    type: 'send',
    amount: 1.2,
    currency: 'ETH',
    status: 'completed',
    date: new Date('2023-12-12T15:50:00'),
    recipient: 'Kate Brown',
    description: 'Smart contract interaction',
    fee: 0.03,
    category: 'DeFi'
  },
  {
    id: 'txn_019',
    type: 'withdrawal',
    amount: 250.00,
    currency: 'USD',
    status: 'completed',
    date: new Date('2023-12-10T12:30:00'),
    recipient: 'Bank of America',
    description: 'Emergency withdrawal',
    fee: 3.00,
    category: 'Emergency'
  },
  {
    id: 'txn_020',
    type: 'receive',
    amount: 5000.00,
    currency: 'USD',
    status: 'completed',
    date: new Date('2023-12-05T09:00:00'),
    sender: 'Lisa Davis',
    description: 'Investment return',
    fee: 0,
    category: 'Investment'
  }
];

export default function TransactionHistoryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = mockTransactions.filter(transaction => {
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesCurrency = currencyFilter === 'all' || transaction.currency === currencyFilter;

      return matchesSearch && matchesType && matchesStatus && matchesCurrency;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, typeFilter, statusFilter, currencyFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalSent = mockTransactions
      .filter(t => t.type === 'send' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalReceived = mockTransactions
      .filter(t => t.type === 'receive' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalFees = mockTransactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.fee, 0);

    const typeBreakdown = mockTransactions.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalSent, totalReceived, totalFees, typeBreakdown };
  }, []);

  const handleExport = (format: 'csv' | 'pdf') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Transaction history exported as ${format.toUpperCase()}`);
    }, 1500);
  };

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'pending') return Clock;
    if (status === 'failed') return XCircle;
    
    switch (type) {
      case 'send':
        return ArrowUpRight;
      case 'receive':
        return ArrowDownLeft;
      case 'deposit':
        return Plus;
      case 'withdrawal':
        return Minus;
      default:
        return ArrowUpRight;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'send':
        return 'text-red-600';
      case 'receive':
        return 'text-green-600';
      case 'deposit':
        return 'text-blue-600';
      case 'withdrawal':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }
    return `${amount} ${currency}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, statusFilter, currencyFilter]);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Transaction History</h1>
                <p className="text-gray-600">View and analyze all your transactions</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleExport('csv')}
                disabled={isLoading}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('pdf')}
                disabled={isLoading}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white border">
              <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-6">
              {/* Filters */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search transactions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="send">Send</SelectItem>
                          <SelectItem value="receive">Receive</SelectItem>
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="withdrawal">Withdrawal</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                        <SelectTrigger className="w-full sm:w-[120px]">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="BTC">BTC</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date-desc">Newest</SelectItem>
                          <SelectItem value="date-asc">Oldest</SelectItem>
                          <SelectItem value="amount-desc">Highest</SelectItem>
                          <SelectItem value="amount-asc">Lowest</SelectItem>
                          <SelectItem value="type">Type</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction List */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 animate-pulse">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      ))}
                    </div>
                  ) : paginatedTransactions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Filter className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                      <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paginatedTransactions.map((transaction) => {
                        const Icon = getTransactionIcon(transaction.type, transaction.status);
                        return (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(transaction.type)} bg-gray-100`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-gray-900">{transaction.description}</p>
                                  <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                                    {transaction.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>{formatDate(transaction.date)}</span>
                                  <span>•</span>
                                  <span className="capitalize">{transaction.type}</span>
                                  {(transaction.recipient || transaction.sender) && (
                                    <>
                                      <span>•</span>
                                      <span>
                                        {transaction.type === 'send' || transaction.type === 'withdrawal' 
                                          ? `To: ${transaction.recipient}` 
                                          : `From: ${transaction.sender}`}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${
                                transaction.type === 'receive' || transaction.type === 'deposit' 
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                              }`}>
                                {transaction.type === 'receive' || transaction.type === 'deposit' ? '+' : '-'}
                                {formatAmount(transaction.amount, transaction.currency)}
                              </p>
                              {transaction.fee > 0 && (
                                <p className="text-sm text-gray-500">
                                  Fee: {formatAmount(transaction.fee, transaction.currency)}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Sent</p>
                        <p className="text-2xl font-bold text-red-600">${analytics.totalSent.toLocaleString()}</p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Received</p>
                        <p className="text-2xl font-bold text-green-600">${analytics.totalReceived.toLocaleString()}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Fees</p>
                        <p className="text-2xl font-bold text-orange-600">${analytics.totalFees.toFixed(2)}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Net Balance</p>
                        <p className={`text-2xl font-bold ${
                          analytics.totalReceived - analytics.totalSent >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${(analytics.totalReceived - analytics.totalSent).toLocaleString()}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Transaction Type Breakdown */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Transaction Type Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(analytics.typeBreakdown).map(([type, count]) => (
                      <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                        <p className="text-sm text-gray-600 capitalize">{type}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Transaction Details Modal */}
          <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
              </DialogHeader>
              {selectedTransaction && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {React.createElement(getTransactionIcon(selectedTransaction.type, selectedTransaction.status), {
                        className: `h-6 w-6 ${getTypeColor(selectedTransaction.type)}`
                      })}
                      <div>
                        <p className="font-medium">{selectedTransaction.description}</p>
                        <p className="text-sm text-gray-500 capitalize">{selectedTransaction.type}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(selectedTransaction.status)}>
                      {selectedTransaction.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className={`font-medium ${
                        selectedTransaction.type === 'receive' || selectedTransaction.type === 'deposit' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {selectedTransaction.type === 'receive' || selectedTransaction.type === 'deposit' ? '+' : '-'}
                        {formatAmount(selectedTransaction.amount, selectedTransaction.currency)}
                      </span>
                    </div>

                    {selectedTransaction.fee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fee</span>
                        <span className="font-medium">{formatAmount(selectedTransaction.fee, selectedTransaction.currency)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">{formatDate(selectedTransaction.date)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono text-sm">{selectedTransaction.id}</span>
                    </div>

                    {selectedTransaction.hash && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hash</span>
                        <span className="font-mono text-sm text-blue-600">{selectedTransaction.hash}</span>
                      </div>
                    )}

                    {(selectedTransaction.recipient || selectedTransaction.sender) && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {selectedTransaction.type === 'send' || selectedTransaction.type === 'withdrawal' ? 'To' : 'From'}
                        </span>
                        <span className="font-medium">
                          {selectedTransaction.recipient || selectedTransaction.sender}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium">{selectedTransaction.category}</span>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
}