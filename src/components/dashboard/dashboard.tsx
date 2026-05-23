
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, BarChart3, Landmark } from "lucide-react";

import dynamic from 'next/dynamic';

const Overview = dynamic(() => import('./overview').then(m => m.Overview), { ssr: false });
const CalendarCard = dynamic(() => import('./calendar-card').then(m => m.CalendarCard), { ssr: false });
const StatsRow = dynamic(() => import('./stats-row').then(m => m.StatsRow), { ssr: false });
const RecentTransactions = dynamic(() => import('./recent-transactions').then(m => m.RecentTransactions), { ssr: false });
const AccountBalances = dynamic(() => import('./account-balances').then(m => m.AccountBalances), { ssr: false });
const PendingInvoicesWidget = dynamic(() => import('./pending-invoices-widget').then(m => m.PendingInvoicesWidget), { ssr: false });
const UpcomingBillsWidget = dynamic(() => import('./upcoming-bills-widget').then(m => m.UpcomingBillsWidget), { ssr: false });
const BankingStatsRow = dynamic(() => import('./banking-stats-row').then(m => m.BankingStatsRow), { ssr: false });
const BankBalancesChart = dynamic(() => import('./bank-balances-chart').then(m => m.BankBalancesChart), { ssr: false });
const LatestBankTransactions = dynamic(() => import('./latest-bank-transactions').then(m => m.LatestBankTransactions), { ssr: false });

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export function Dashboard() {
  const [recentCustomers, setRecentCustomers] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulatedLoading, setIsSimulatedLoading] = useState(true);

  useEffect(() => {
    const fetchRecentCustomers = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch('/api/customers', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errBody = await response.json().catch(() => null);
          throw new Error(errBody?.error || response.statusText || 'Failed to fetch customers');
        }
        const data = await response.json();
        const sorted = Array.isArray(data)
          ? data
            .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .slice(0, 5)
          : [];
        setRecentCustomers(sorted);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn('Fetch recent customers aborted (timeout or unmount)');
        } else {
          console.error('Error fetching recent customers:', error);
        }
        setRecentCustomers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentCustomers();

    const timer = setTimeout(() => {
      setIsSimulatedLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  if (isSimulatedLoading || isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden bg-background min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-emerald-500/5 opacity-50 blur-3xl" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="relative w-40 h-40 flex items-center justify-center mb-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute inset-0 border-t-2 border-emerald-400 rounded-full opacity-70"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], rotate: [360, 180, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute inset-2 border-b-2 border-emerald-500 rounded-full opacity-50"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-6 h-6 bg-emerald-400 rounded-full shadow-[0_0_30px_rgba(52,211,153,1)] flex items-center justify-center"
          >
             <Activity className="h-3 w-3 text-black animate-pulse" />
          </motion.div>
        </motion.div>
        
        <motion.h3
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-2xl font-black uppercase tracking-widest text-emerald-400 mb-3 relative z-10"
        >
          Initializing System
        </motion.h3>
        <p className="text-sm font-medium text-foreground/50 uppercase tracking-widest relative z-10">
          Loading dashboard modules & establishing secure uplink...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight font-headline text-foreground">Dashboard</h2>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
      </div>

      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="bg-foreground/5 p-1 border border-foreground/10 rounded-xl gap-1">
          <TabsTrigger
            value="financial"
            className="rounded-lg flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md text-muted-foreground transition-all px-4"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Financial Overview
          </TabsTrigger>
          <TabsTrigger
            value="banking"
            className="rounded-lg flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md text-muted-foreground transition-all px-4"
          >
            <Landmark className="h-3.5 w-3.5" />
            Banking Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6">
          {/* Stats Row */}
          <StatsRow />

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Financial Health Chart */}
              <Card className="bg-foreground/5 border border-foreground/10 backdrop-blur-sm shadow-sm overflow-hidden">
                <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
                  <div className="space-y-1">
                    <CardTitle className="font-headline text-foreground text-xl flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary opacity-70" />
                      Financial Health
                    </CardTitle>
                    <CardDescription className="text-slate-400">Chart of Accounts Balances by Account Type</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>

              {/* Recent Transactions List */}
              <RecentTransactions />

              {/* Newly Added Customers */}
              <Card className="bg-foreground/5 border border-foreground/10 backdrop-blur-sm shadow-sm overflow-hidden">
                <div className="h-0.5 w-full bg-gradient-to-r from-violet-500 to-pink-500" />
                <CardHeader className="pb-3 pt-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-violet-500/10">
                        <Users className="h-4 w-4 text-violet-400" />
                      </div>
                      <div>
                        <CardTitle className="font-headline text-foreground">Newly Added Customers</CardTitle>
                        <CardDescription className="text-slate-400 mt-0.5">
                          Most recent customers in the system
                        </CardDescription>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground bg-foreground/10 border border-foreground/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Last 5</span>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center text-sm text-muted-foreground py-8">Loading...</div>
                  ) : recentCustomers.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-8">No customers yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {recentCustomers.map((customer: any, idx: number) => (
                        <div
                          key={customer.id ?? customer.code ?? `${(customer.customerName || customer.name || 'cust')}-${idx}`}
                          className="flex items-center gap-3 p-3 rounded-xl border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 hover:border-foreground/20 transition-all"
                        >
                          <Avatar className="h-9 w-9 ring-2 ring-violet-500/20">
                            <AvatarFallback className="bg-violet-500/15 text-violet-400 font-bold text-sm">
                              {(customer.customerName || customer.name || "C").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-sm font-semibold leading-none text-foreground truncate">
                              {customer.customerName || customer.name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {customer.code || "—"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-3 space-y-6">
              {/* Calendar & Events */}
              <CalendarCard />

              {/* Account Balances */}
              <AccountBalances />

              {/* Invoices & Bills Widgets */}
              <div className="grid grid-cols-2 gap-4">
                <PendingInvoicesWidget />
                <UpcomingBillsWidget />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="banking" className="space-y-6">
          {/* Banking Header */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-blue-500/15 bg-gradient-to-r from-blue-500/8 to-transparent backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground font-headline">Banking Performance</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Real-time overview of all bank accounts</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Live
            </span>
          </div>

          <BankingStatsRow />

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            <BankBalancesChart />
            <LatestBankTransactions />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
