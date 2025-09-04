"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ArrowLeft, Copy, Share2, Download, Mail, Phone, Wallet, QrCode, Clock, CheckCircle, XCircle, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface PaymentRequest {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "expired";
  requester: string;
  createdAt: string;
  expiresAt: string;
}

interface WalletAddress {
  currency: string;
  address: string;
  icon: React.ReactNode;
}

export default function ReceiveMoneyPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("wallet");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  // Mock wallet addresses
  const walletAddresses: WalletAddress[] = [
    {
      currency: "BTC",
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      icon: <div className="w-4 h-4 rounded-full bg-orange-500" />
    },
    {
      currency: "ETH", 
      address: "0x742d35cc67d8cf5b7f8b8b8b8b8b8b8b8b8b8b8b",
      icon: <div className="w-4 h-4 rounded-full bg-blue-500" />
    },
    {
      currency: "USDT",
      address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oYvzzc",
      icon: <div className="w-4 h-4 rounded-full bg-green-500" />
    }
  ];

  // Mock recent payment requests
  const recentRequests: PaymentRequest[] = [
    {
      id: "1",
      amount: 250,
      currency: "USD",
      status: "pending",
      requester: "john@example.com",
      createdAt: "2024-01-15T10:30:00Z",
      expiresAt: "2024-01-16T10:30:00Z"
    },
    {
      id: "2", 
      amount: 0.005,
      currency: "BTC",
      status: "completed",
      requester: "+1 (555) 123-4567",
      createdAt: "2024-01-14T15:45:00Z",
      expiresAt: "2024-01-15T15:45:00Z"
    },
    {
      id: "3",
      amount: 100,
      currency: "USD", 
      status: "expired",
      requester: "sarah@example.com",
      createdAt: "2024-01-13T09:15:00Z",
      expiresAt: "2024-01-14T09:15:00Z"
    }
  ];

  const userContact = {
    email: "user@example.com",
    phone: "+1 (555) 987-6543"
  };

  const generateQRCode = useCallback(() => {
    setIsGeneratingQR(true);
    // Simulate QR code generation
    setTimeout(() => {
      setIsGeneratingQR(false);
      toast.success("QR code generated successfully");
    }, 1000);
  }, []);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  const sharePaymentRequest = useCallback(() => {
    const paymentData = {
      method: selectedMethod,
      amount: amount,
      currency: currency
    };
    const shareUrl = `https://wallet.app/pay?data=${encodeURIComponent(JSON.stringify(paymentData))}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Payment Request",
        text: `Request payment of ${amount} ${currency}`,
        url: shareUrl
      });
    } else {
      copyToClipboard(shareUrl, "Payment link");
    }
  }, [selectedMethod, amount, currency, copyToClipboard]);

  const downloadQRCode = useCallback(() => {
    // Mock QR code download
    toast.success("QR code downloaded successfully");
  }, []);

  const getCurrentAddress = useCallback(() => {
    switch (selectedMethod) {
      case "wallet":
        const currentWallet = walletAddresses.find(w => w.currency === currency);
        return currentWallet?.address || "";
      case "email":
        return userContact.email;
      case "phone":
        return userContact.phone;
      default:
        return "";
    }
  }, [selectedMethod, currency, walletAddresses, userContact]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "expired":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "completed":
        return "text-green-600 bg-green-50";
      case "expired":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-600 hover:bg-gray-100 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Receive Money</h1>
            <div className="w-9" />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Payment Method Tabs */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Choose Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="wallet" className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Wallet
                    </TabsTrigger>
                    <TabsTrigger value="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="wallet" className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="currency">Select Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                          <SelectItem value="USDT">Tether (USDT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {currency !== "USD" && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {walletAddresses.find(w => w.currency === currency)?.icon}
                          <span className="font-medium">{currency} Address</span>
                        </div>
                        <p className="text-sm text-gray-600 break-all">
                          {getCurrentAddress()}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="email" className="mt-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="font-medium">Email Address</span>
                      </div>
                      <p className="text-sm text-gray-600">{userContact.email}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="phone" className="mt-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="font-medium">Phone Number</span>
                      </div>
                      <p className="text-sm text-gray-600">{userContact.phone}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Amount Request */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Request Amount (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={generateQRCode}
                    disabled={isGeneratingQR}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {isGeneratingQR ? "Generating..." : "Generate QR Code"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Display */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {isGeneratingQR ? (
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                    ) : (
                      <div className="text-center">
                        <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">QR Code Preview</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {amount ? `${amount} ${currency}` : "Any amount"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(getCurrentAddress(), "Address")}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadQRCode}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Share Options */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Share Payment Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={sharePaymentRequest}
                  className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Payment Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(`Payment request link`, "Payment link")}
                  className="w-full flex items-center gap-2"
                >
                  <Link2 className="w-4 h-4" />
                  Copy Payment Link
                </Button>
              </CardContent>
            </Card>

            {/* Recent Requests */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Recent Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <p className="font-medium">
                          {request.amount} {request.currency}
                        </p>
                        <p className="text-sm text-gray-600">{request.requester}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent payment requests</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}