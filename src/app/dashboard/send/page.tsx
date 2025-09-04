"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Search, 
  Star, 
  Plus, 
  DollarSign, 
  Bitcoin, 
  Coins,
  Eye,
  EyeOff,
  Check,
  User,
  Mail,
  Phone,
  Wallet,
  Lock,
  Shield,
  ChevronRight,
  AlertCircle,
  Copy
} from 'lucide-react';

// Mock data
const mockContacts = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'JD', favorite: true, lastUsed: '2 days ago' },
  { id: '2', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'SW', favorite: false, lastUsed: '1 week ago' },
  { id: '3', name: 'Mike Chen', email: 'mike@example.com', avatar: 'MC', favorite: true, lastUsed: '3 days ago' },
  { id: '4', name: 'Emma Brown', email: 'emma@example.com', avatar: 'EB', favorite: false, lastUsed: '2 weeks ago' },
  { id: '5', name: 'Alex Johnson', email: 'alex@example.com', avatar: 'AJ', favorite: true, lastUsed: '5 days ago' }
];

const mockBalances = {
  USD: { balance: 2500.50, symbol: '$' },
  BTC: { balance: 0.15432, symbol: '₿' },
  ETH: { balance: 2.8954, symbol: 'Ξ' }
};

const exchangeRates = {
  BTC: 42500,
  ETH: 2300
};

const fees = {
  USD: 1.50,
  BTC: 0.0001,
  ETH: 0.005
};

export default function SendMoneyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [newRecipient, setNewRecipient] = useState({ type: 'email', value: '', name: '' });
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteContacts = filteredContacts.filter(contact => contact.favorite);
  const recentContacts = filteredContacts.filter(contact => !contact.favorite);

  const calculateTotal = () => {
    const amountValue = parseFloat(amount) || 0;
    const feeValue = fees[currency];
    return amountValue + feeValue;
  };

  const getUSDValue = () => {
    if (currency === 'USD') return parseFloat(amount) || 0;
    const rate = exchangeRates[currency];
    return ((parseFloat(amount) || 0) * rate);
  };

  const isValidAmount = () => {
    const amountValue = parseFloat(amount) || 0;
    const balance = mockBalances[currency].balance;
    return amountValue > 0 && amountValue <= balance;
  };

  const handleRecipientSelect = (contact) => {
    setSelectedRecipient(contact);
    setNewRecipient({ type: 'email', value: '', name: '' });
  };

  const handleNewRecipientSubmit = () => {
    if (newRecipient.value.trim()) {
      const recipient = {
        id: 'new',
        name: newRecipient.name || newRecipient.value,
        email: newRecipient.type === 'email' ? newRecipient.value : '',
        phone: newRecipient.type === 'phone' ? newRecipient.value : '',
        wallet: newRecipient.type === 'wallet' ? newRecipient.value : '',
        avatar: (newRecipient.name || newRecipient.value).substring(0, 2).toUpperCase(),
        favorite: false
      };
      setSelectedRecipient(recipient);
    }
  };

  const handleMaxAmount = () => {
    const balance = mockBalances[currency].balance;
    const fee = fees[currency];
    const maxAmount = Math.max(0, balance - fee);
    setAmount(maxAmount.toString());
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedRecipient && !newRecipient.value.trim()) {
        toast.error('Please select or enter a recipient');
        return;
      }
      if (newRecipient.value.trim() && !selectedRecipient) {
        handleNewRecipientSubmit();
      }
    } else if (currentStep === 2) {
      if (!isValidAmount()) {
        toast.error('Please enter a valid amount');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSendMoney = async () => {
    if (!pin || pin.length !== 4) {
      toast.error('Please enter your 4-digit PIN');
      return;
    }
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const txId = `TX${Date.now().toString().slice(-8)}`;
      setTransactionId(txId);
      setIsSuccess(true);
      setIsLoading(false);
      toast.success('Money sent successfully!');
    }, 2000);
  };

  const copyTransactionId = () => {
    navigator.clipboard.writeText(transactionId);
    toast.success('Transaction ID copied to clipboard');
  };

  if (isSuccess) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-md mx-auto">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Money Sent Successfully!</h1>
              <p className="text-gray-600 mb-6">Your transfer has been processed</p>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Sent</span>
                    <span className="font-semibold">{mockBalances[currency].symbol}{amount} {currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To</span>
                    <span className="font-semibold">{selectedRecipient?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Fee</span>
                    <span>{mockBalances[currency].symbol}{fees[currency]} {currency}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{transactionId}</span>
                      <Button variant="ghost" size="sm" onClick={copyTransactionId}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setIsSuccess(false);
                  setCurrentStep(1);
                  setSelectedRecipient(null);
                  setAmount('');
                  setPin('');
                  setTermsAccepted(false);
                }}
              >
                Send Another Transfer
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="bg-white shadow-sm p-4 flex items-center justify-between rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Send Money</h1>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep}/3
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white px-4 pb-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>Recipient</span>
              <span className={`text-xs ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>Amount</span>
              <span className={`text-xs ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>Confirm</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4">
            {/* Step 1: Recipient Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Search */}
                <Card>
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search contacts or enter details"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* New Recipient Input */}
                {!selectedRecipient && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Plus className="h-5 w-5" />
                        Add New Recipient
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="recipient-type">Contact Method</Label>
                        <Select value={newRecipient.type} onValueChange={(value) => setNewRecipient(prev => ({ ...prev, type: value, value: '' }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Address
                              </div>
                            </SelectItem>
                            <SelectItem value="phone">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone Number
                              </div>
                            </SelectItem>
                            <SelectItem value="wallet">
                              <div className="flex items-center gap-2">
                                <Wallet className="h-4 w-4" />
                                Wallet Address
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="recipient-value">
                          {newRecipient.type === 'email' ? 'Email Address' : 
                           newRecipient.type === 'phone' ? 'Phone Number' : 'Wallet Address'}
                        </Label>
                        <Input
                          id="recipient-value"
                          value={newRecipient.value}
                          onChange={(e) => setNewRecipient(prev => ({ ...prev, value: e.target.value }))}
                          placeholder={
                            newRecipient.type === 'email' ? 'user@example.com' :
                            newRecipient.type === 'phone' ? '+1 (555) 123-4567' : '0x1234...abcd'
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="recipient-name">Name (Optional)</Label>
                        <Input
                          id="recipient-name"
                          value={newRecipient.name}
                          onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Recipient's name"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Selected Recipient */}
                {selectedRecipient && (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-green-600 text-white">
                            {selectedRecipient.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{selectedRecipient.name}</h3>
                          <p className="text-sm text-gray-600">
                            {selectedRecipient.email || selectedRecipient.phone || selectedRecipient.wallet}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedRecipient(null)}
                        >
                          Change
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Favorites */}
                {favoriteContacts.length > 0 && !selectedRecipient && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Favorites
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {favoriteContacts.map(contact => (
                        <div 
                          key={contact.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleRecipientSelect(contact)}
                        >
                          <Avatar>
                            <AvatarFallback>{contact.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">{contact.name}</h3>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Recent Contacts */}
                {recentContacts.length > 0 && !selectedRecipient && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {recentContacts.map(contact => (
                        <div 
                          key={contact.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleRecipientSelect(contact)}
                        >
                          <Avatar>
                            <AvatarFallback>{contact.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">{contact.name}</h3>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                            <p className="text-xs text-gray-500">Last used {contact.lastUsed}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Step 2: Amount & Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Recipient Summary */}
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-green-600 text-white">
                          {selectedRecipient?.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">Sending to {selectedRecipient?.name}</h3>
                        <p className="text-sm text-gray-600">
                          {selectedRecipient?.email || selectedRecipient?.phone || selectedRecipient?.wallet}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Currency & Balance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Available Balance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {currency === 'USD' && <DollarSign className="h-5 w-5" />}
                        {currency === 'BTC' && <Bitcoin className="h-5 w-5" />}
                        {currency === 'ETH' && <Coins className="h-5 w-5" />}
                        <span className="font-medium">{currency}</span>
                      </div>
                      <span className="text-xl font-semibold">
                        {mockBalances[currency].symbol}{mockBalances[currency].balance.toFixed(currency === 'USD' ? 2 : 5)}
                      </span>
                    </div>
                    
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              USD - US Dollar
                            </div>
                          </SelectItem>
                          <SelectItem value="BTC">
                            <div className="flex items-center gap-2">
                              <Bitcoin className="h-4 w-4" />
                              BTC - Bitcoin
                            </div>
                          </SelectItem>
                          <SelectItem value="ETH">
                            <div className="flex items-center gap-2">
                              <Coins className="h-4 w-4" />
                              ETH - Ethereum
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Amount Input */}
                <Card>
                  <CardHeader>
                    <CardTitle>Amount</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-gray-600">
                        {mockBalances[currency].symbol}
                      </div>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-8 text-lg font-semibold"
                        step={currency === 'USD' ? '0.01' : '0.00001'}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={handleMaxAmount}
                      >
                        Max
                      </Button>
                    </div>
                    
                    {amount && currency !== 'USD' && (
                      <p className="text-sm text-gray-600">
                        ≈ ${getUSDValue().toLocaleString()} USD
                      </p>
                    )}
                    
                    {amount && (
                      <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Amount</span>
                          <span>{mockBalances[currency].symbol}{amount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Transaction Fee</span>
                          <span>{mockBalances[currency].symbol}{fees[currency]}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>{mockBalances[currency].symbol}{calculateTotal().toFixed(currency === 'USD' ? 2 : 5)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Description (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="What's this for?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                  </CardContent>
                </Card>

                {/* Exchange Rate (for crypto) */}
                {currency !== 'USD' && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Exchange Rate</span>
                        <span className="text-sm font-medium">
                          1 {currency} = ${exchangeRates[currency].toLocaleString()} USD
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Step 3: Review & Confirm */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Transaction Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Transaction Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar>
                        <AvatarFallback className="bg-green-600 text-white">
                          {selectedRecipient?.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedRecipient?.name}</h3>
                        <p className="text-sm text-gray-600">
                          {selectedRecipient?.email || selectedRecipient?.phone || selectedRecipient?.wallet}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount</span>
                        <span className="font-semibold">{mockBalances[currency].symbol}{amount} {currency}</span>
                      </div>
                      {currency !== 'USD' && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">USD Equivalent</span>
                          <span>${getUSDValue().toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction Fee</span>
                        <span>{mockBalances[currency].symbol}{fees[currency]} {currency}</span>
                      </div>
                      {description && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Description</span>
                          <span className="text-right max-w-40 truncate">{description}</span>
                        </div>
                      )}
                      <hr />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>{mockBalances[currency].symbol}{calculateTotal().toFixed(currency === 'USD' ? 2 : 5)} {currency}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-blue-600" />
                      Security Confirmation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="pin">Enter your 4-digit PIN</Label>
                      <div className="relative">
                        <Input
                          id="pin"
                          type={showPin ? 'text' : 'password'}
                          placeholder="••••"
                          value={pin}
                          onChange={(e) => setPin(e.target.value.slice(0, 4))}
                          maxLength={4}
                          className="pr-10"
                          autoComplete="off"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPin(!showPin)}
                        >
                          {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={setTermsAccepted}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm leading-5">
                        I confirm that the transaction details are correct and agree to the{' '}
                        <span className="text-green-600 underline">terms and conditions</span>
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Features */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900">Security Notice</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Your transaction is protected by 256-bit encryption. Please verify all details before confirming.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-6">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevStep} className="flex-1">
                  Back
                </Button>
              )}
              
              <Button
                onClick={currentStep === 3 ? handleSendMoney : handleNextStep}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={
                  (currentStep === 1 && !selectedRecipient && !newRecipient.value.trim()) ||
                  (currentStep === 2 && !isValidAmount()) ||
                  (currentStep === 3 && (!pin || pin.length !== 4 || !termsAccepted)) ||
                  isLoading
                }
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : currentStep === 3 ? (
                  'Send Money'
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}