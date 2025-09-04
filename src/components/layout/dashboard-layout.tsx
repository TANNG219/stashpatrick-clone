"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Home,
  Send,
  Download,
  History,
  Plus,
  Settings,
  Menu,
  X,
  HelpCircle,
  LogOut,
  CheckCircle,
  User
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Send Money', href: '/dashboard/send', icon: Send },
  { name: 'Receive Money', href: '/dashboard/receive', icon: Download },
  { name: 'Transaction History', href: '/dashboard/history', icon: History },
  { name: 'Add Funds', href: '/dashboard/add-funds', icon: Plus },
  { name: 'Account Settings', href: '/dashboard/settings', icon: Settings },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Mock user data (since no auth is set up yet)
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    emailVerified: true
  };

  const userInitials = user.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  const accountType = user.emailVerified ? 'Verified Account' : 'Standard Account';
  const isVerified = user.emailVerified;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      // Mock sign out process
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Signed out successfully');
      router.push('/');
    } catch (err) {
      toast.error('Failed to sign out');
    } finally {
      setIsSigningOut(false);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A4C471] via-[#8DB458] to-[#7CB342]">
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-white">MoneyFlow</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={closeSidebar}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transition-transform">
            <div className="flex h-full flex-col">
              {/* Mobile sidebar header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  type="button"
                  className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={closeSidebar}
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile sidebar content */}
              <div className="flex-1 flex flex-col">
                {/* User section */}
                <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-medium text-sm">
                      {userInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name || user.email}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        {isVerified && (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                        <p className="text-xs text-gray-500">{accountType}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeSidebar}
                        className={cn(
                          "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* Bottom section */}
                <div className="p-4 border-t space-y-1">
                  <Link
                    href="/help"
                    onClick={closeSidebar}
                    className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <HelpCircle className="mr-3 h-5 w-5 flex-shrink-0" />
                    Help & Support
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full group flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                    {isSigningOut ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop layout */}
      <div className="hidden lg:flex h-screen">
        {/* Desktop sidebar */}
        <div className="w-64 bg-white shadow-lg flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              MoneyFlow
            </h1>
          </div>

          {/* User section */}
          <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-medium">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || user.email}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {isVerified && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <p className="text-xs text-gray-500">{accountType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-md transform scale-[1.02]"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:transform hover:scale-[1.01]"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-6 border-t space-y-1">
            <Link
              href="/help"
              className="group flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <HelpCircle className="mr-3 h-5 w-5 flex-shrink-0" />
              Help & Support
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full group flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile main content */}
      <div className="lg:hidden">
        <main className="pb-safe">
          {children}
        </main>
      </div>
    </div>
  );
};