"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Building2, Bitcoin, Coins, Smartphone, Shield, Clock, Copy, CheckCircle, AlertCircle, Loader2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  processingTime: string;
  fee: string;
  minAmount: number;
  maxAmount: number;
  description: string;
}

interface RecentDeposit {
  id: string;
  method: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

interface FormData {
  amount: string;
  currency: string;
  // Bank Transfer
  routingNumber: string;
  accountNumber: string;
  accountType: string;
  // Card
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  // Crypto
  cryptoCurrency: string;
  // Wire
  swiftCode: string;
  bankName: string;
  bankAddress: string;
  accountHolderName: string;
}

export default function AddFundsPage() {
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    currency: 'USD',
    routingNumber: '',
    accountNumber: '',
    accountType: 'checking',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    cryptoCurrency: 'BTC',
    swiftCode: '',
    bankName: '',
    bankAddress: '',
    accountHolderName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentBalance = 2450.75;
  const accountLimits = {
    daily: 10000,
    monthly: 50000,
    dailyUsed: 1200,
    monthlyUsed: 8500,
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'bank',
      name: 'Bank Transfer (ACH)',
      icon: <Building2 className="w-5 h-5" />,
      processingTime: '3-5 business days',
      fee: 'Free',
      minAmount: 10,
      maxAmount: 25000,
      description: 'Transfer funds directly from your bank account'
    },
    {
      id: 'card',
      name: 'Debit/Credit Card',
      icon: <CreditCard className="w-5 h-5" />,
      processingTime: 'Instant',
      fee: '2.9% + $0.30',
      minAmount: 1,
      maxAmount: 5000,
      description: 'Add funds instantly with your card'
    },
    {
      id: 'crypto',
      name: 'Crypto Deposit',
      icon: <Bitcoin className="w-5 h-5" />,
      processingTime: '1-6 confirmations',
      fee: 'Network fees apply',
      minAmount: 5,
      maxAmount: 100000,
      description: 'Deposit cryptocurrency to your wallet'
    },
    {
      id: 'wire',
      name: 'Wire Transfer',
      icon: <Coins className="w-5 h-5" />,
      processingTime: '1-2 business days',
      fee: '$25',
      minAmount: 1000,
      maxAmount: 1000000,
      description: 'For large amounts and international transfers'
    },
    {
      id: 'digital',
      name: 'Apple Pay / Google Pay',
      icon: <Smartphone className="w-5 h-5" />,
      processingTime: 'Instant',
      fee: '2.9%',
      minAmount: 1,
      maxAmount: 2000,
      description: 'Quick and secure digital wallet payment'
    }
  ];

  const recentDeposits: RecentDeposit[] = [
    { id: '1', method: 'Bank Transfer', amount: 500, currency: 'USD', status: 'completed', date: '2024-01-15' },
    { id: '2', method: 'Credit Card', amount: 150, currency: 'USD', status: 'pending', date: '2024-01-14' },
    { id: '3', method: 'BTC Deposit', amount: 0.005, currency: 'BTC', status: 'completed', date: '2024-01-13' },
  ];

  const cryptoAddresses = {
    BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    ETH: '0x742d35Cc6634C0532925a3b8D2b76A8aFb50F000',
    USDC: '0x742d35Cc6634C0532925a3b8D2b76A8aFb50F000',
    USDT: '0x742d35Cc6634C0532925a3b8D2b76A8aFb50F000',
  };

  useEffect(() => {
    calculateFee();
  }, [formData.amount, selectedMethod]);

  const calculateFee = () => {
    const amount = parseFloat(formData.amount) || 0;
    let fee = 0;

    switch (selectedMethod) {
      case 'bank':
        fee = 0;
        break;
      case 'card':
        fee = amount * 0.029 + 0.30;
        break;
      case 'crypto':
        fee = 0; // Network fees are external
        break;
      case 'wire':
        fee = 25;
        break;
      case 'digital':
        fee = amount * 0.029;
        break;
    }

    setCalculatedFee(fee);
    setTotalAmount(amount + fee);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const amount = parseFloat(formData.amount);
    const method = paymentMethods.find(m => m.id === selectedMethod);

    if (!formData.amount || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (method && (amount < method.minAmount || amount > method.maxAmount)) {
      newErrors.amount = `Amount must be between $${method.minAmount} and $${method.maxAmount}`;
    }

    switch (selectedMethod) {
      case 'bank':
        if (!formData.routingNumber || formData.routingNumber.length !== 9) {
          newErrors.routingNumber = 'Routing number must be 9 digits';
        }
        if (!formData.accountNumber || formData.accountNumber.length < 4) {
          newErrors.accountNumber = 'Please enter a valid account number';
        }
        break;
      case 'card':
        if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
          newErrors.cardNumber = 'Please enter a valid card number';
        }
        if (!formData.expiryMonth || !formData.expiryYear) {
          newErrors.expiry = 'Please enter card expiry date';
        }
        if (!formData.cvv || formData.cvv.length < 3) {
          newErrors.cvv = 'Please enter a valid CVV';
        }
        if (!formData.cardholderName) {
          newErrors.cardholderName = 'Please enter the cardholder name';
        }
        break;
      case 'wire':
        if (!formData.swiftCode) {
          newErrors.swiftCode = 'Please enter SWIFT code';
        }
        if (!formData.bankName) {
          newErrors.bankName = 'Please enter bank name';
        }
        if (!formData.accountHolderName) {
          newErrors.accountHolderName = 'Please enter account holder name';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowConfirmation(true);
      toast.success('Deposit initiated successfully!');
    } catch (error) {
      toast.error('Failed to process deposit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A4C471] to-[#7CB342]">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4 text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-white">Add Funds</h1>
            <p className="text-white/80">Choose your preferred payment method</p>
          </div>
        </div>

        {/* Balance and Limits */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-semibold">${currentBalance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Limit</p>
                <p className="text-lg">${(accountLimits.daily - accountLimits.dailyUsed).toLocaleString()} remaining</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(accountLimits.dailyUsed / accountLimits.daily) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Limit</p>
                <p className="text-lg">${(accountLimits.monthly - accountLimits.monthlyUsed).toLocaleString()} remaining</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(accountLimits.monthlyUsed / accountLimits.monthly) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
                <CardDescription>Choose how you'd like to add funds to your wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
                    {paymentMethods.map((method) => (
                      <TabsTrigger key={method.id} value={method.id} className="flex flex-col items-center p-3">
                        {method.icon}
                        <span className="text-xs mt-1 hidden sm:block">{method.name.split(' ')[0]}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Amount Input */}
                  <div className="mb-6">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="flex gap-2 mt-1">
                      <div className="flex-1">
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => handleInputChange('amount', e.target.value)}
                          className={errors.amount ? 'border-red-500' : ''}
                        />
                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                      </div>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="BTC">BTC</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Method-specific forms */}
                  {paymentMethods.map((method) => (
                    <TabsContent key={method.id} value={method.id}>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {method.icon}
                            <h3 className="font-medium">{method.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span>{method.processingTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Coins className="w-4 h-4 text-gray-500" />
                              <span>{method.fee}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bank Transfer Form */}
                        {method.id === 'bank' && (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="routingNumber">Routing Number</Label>
                              <Input
                                id="routingNumber"
                                placeholder="123456789"
                                value={formData.routingNumber}
                                onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                                className={errors.routingNumber ? 'border-red-500' : ''}
                              />
                              {errors.routingNumber && <p className="text-red-500 text-sm mt-1">{errors.routingNumber}</p>}
                            </div>
                            <div>
                              <Label htmlFor="accountNumber">Account Number</Label>
                              <Input
                                id="accountNumber"
                                placeholder="1234567890"
                                value={formData.accountNumber}
                                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                className={errors.accountNumber ? 'border-red-500' : ''}
                              />
                              {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="accountType">Account Type</Label>
                              <Select value={formData.accountType} onValueChange={(value) => handleInputChange('accountType', value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="checking">Checking</SelectItem>
                                  <SelectItem value="savings">Savings</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        {/* Card Form */}
                        {method.id === 'card' && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                                className={errors.cardNumber ? 'border-red-500' : ''}
                              />
                              {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="expiryMonth">Month</Label>
                                <Select value={formData.expiryMonth} onValueChange={(value) => handleInputChange('expiryMonth', value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="MM" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                      <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                        {String(i + 1).padStart(2, '0')}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="expiryYear">Year</Label>
                                <Select value={formData.expiryYear} onValueChange={(value) => handleInputChange('expiryYear', value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="YY" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 10 }, (_, i) => (
                                      <SelectItem key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                                        {String(new Date().getFullYear() + i).slice(-2)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                  id="cvv"
                                  placeholder="123"
                                  value={formData.cvv}
                                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                                  className={errors.cvv ? 'border-red-500' : ''}
                                />
                                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                              </div>
                            </div>
                            {errors.expiry && <p className="text-red-500 text-sm">{errors.expiry}</p>}
                            <div>
                              <Label htmlFor="cardholderName">Cardholder Name</Label>
                              <Input
                                id="cardholderName"
                                placeholder="John Doe"
                                value={formData.cardholderName}
                                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                                className={errors.cardholderName ? 'border-red-500' : ''}
                              />
                              {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
                            </div>
                          </div>
                        )}

                        {/* Crypto Form */}
                        {method.id === 'crypto' && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="cryptoCurrency">Cryptocurrency</Label>
                              <Select value={formData.cryptoCurrency} onValueChange={(value) => handleInputChange('cryptoCurrency', value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                                  <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                                  <SelectItem value="USDT">Tether (USDT)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <Label>Deposit Address</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(cryptoAddresses[formData.cryptoCurrency as keyof typeof cryptoAddresses])}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                              </div>
                              <p className="font-mono text-sm break-all bg-white p-2 rounded border">
                                {cryptoAddresses[formData.cryptoCurrency as keyof typeof cryptoAddresses]}
                              </p>
                              <div className="flex items-center justify-center mt-4">
                                <div className="bg-white p-4 rounded-lg border">
                                  <QrCode className="w-32 h-32 text-gray-400" />
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mt-2 text-center">
                                Scan QR code or copy address above
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Wire Transfer Form */}
                        {method.id === 'wire' && (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="swiftCode">SWIFT Code</Label>
                              <Input
                                id="swiftCode"
                                placeholder="CHASUS33"
                                value={formData.swiftCode}
                                onChange={(e) => handleInputChange('swiftCode', e.target.value)}
                                className={errors.swiftCode ? 'border-red-500' : ''}
                              />
                              {errors.swiftCode && <p className="text-red-500 text-sm mt-1">{errors.swiftCode}</p>}
                            </div>
                            <div>
                              <Label htmlFor="bankName">Bank Name</Label>
                              <Input
                                id="bankName"
                                placeholder="Chase Bank"
                                value={formData.bankName}
                                onChange={(e) => handleInputChange('bankName', e.target.value)}
                                className={errors.bankName ? 'border-red-500' : ''}
                              />
                              {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="bankAddress">Bank Address</Label>
                              <Input
                                id="bankAddress"
                                placeholder="123 Main St, New York, NY 10001"
                                value={formData.bankAddress}
                                onChange={(e) => handleInputChange('bankAddress', e.target.value)}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="accountHolderName">Account Holder Name</Label>
                              <Input
                                id="accountHolderName"
                                placeholder="John Doe"
                                value={formData.accountHolderName}
                                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                                className={errors.accountHolderName ? 'border-red-500' : ''}
                              />
                              {errors.accountHolderName && <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>}
                            </div>
                          </div>
                        )}

                        {/* Digital Wallet */}
                        {method.id === 'digital' && (
                          <div className="text-center py-8">
                            <Smartphone className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium mb-2">Digital Wallet Payment</h3>
                            <p className="text-gray-600 mb-6">
                              You'll be redirected to complete the payment with your preferred digital wallet
                            </p>
                            <div className="flex justify-center gap-4">
                              <div className="bg-black text-white px-4 py-2 rounded-lg">
                                Apple Pay
                              </div>
                              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                                Google Pay
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Summary and Recent Activity */}
          <div className="space-y-6">
            {/* Transaction Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span>${formData.amount || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee</span>
                    <span>${calculatedFee.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Processing time: {paymentMethods.find(m => m.id === selectedMethod)?.processingTime}
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.amount}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Add Funds'
                  )}
                </Button>

                <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2" />
                  SSL Encrypted & Secure
                </div>
              </CardContent>
            </Card>

            {/* Recent Deposits */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Deposits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentDeposits.map((deposit) => (
                    <div key={deposit.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-sm">{deposit.method}</p>
                        <p className="text-xs text-gray-600">{deposit.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {deposit.amount} {deposit.currency}
                        </p>
                        {getStatusBadge(deposit.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Deposit Initiated
            </DialogTitle>
            <DialogDescription>
              Your deposit of ${formData.amount} has been successfully initiated.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Processing Time:</strong> {paymentMethods.find(m => m.id === selectedMethod)?.processingTime}
              </p>
              <p className="text-sm mt-2">
                You'll receive a confirmation email shortly with transaction details.
              </p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => setShowConfirmation(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}