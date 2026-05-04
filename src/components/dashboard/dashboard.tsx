
"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/components/layout/dialog-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StatCard } from "./stat-card";
import { PesoIcon } from "@/components/icons/peso-icon";
import dynamic from 'next/dynamic';

const Overview = dynamic(() => import('./overview').then(m => m.Overview), { ssr: false });
// const SummaryCards = dynamic(() => import('./summary-cards').then(m => m.SummaryCards), { ssr: false }); // Deprecated
// const FinancialDonut = dynamic(() => import('./financial-donut').then(m => m.FinancialDonut), { ssr: false });
const DailyCashFlowChart = dynamic(() => import('./daily-cash-flow-chart').then(m => m.DailyCashFlowChart), { ssr: false });
// const CalendarCard = dynamic(() => import('./calendar-card').then(m => m.CalendarCard), { ssr: false }); // Deprecated
const StatsRow = dynamic(() => import('./stats-row').then(m => m.StatsRow), { ssr: false });
const RecentTransactions = dynamic(() => import('./recent-transactions').then(m => m.RecentTransactions), { ssr: false });
const AccountBalances = dynamic(() => import('./account-balances').then(m => m.AccountBalances), { ssr: false });
const PendingInvoicesWidget = dynamic(() => import('./pending-invoices-widget').then(m => m.PendingInvoicesWidget), { ssr: false });
const UpcomingBillsWidget = dynamic(() => import('./upcoming-bills-widget').then(m => m.UpcomingBillsWidget), { ssr: false });
const BankingStatsRow = dynamic(() => import('./banking-stats-row').then(m => m.BankingStatsRow), { ssr: false });
const BankBalancesChart = dynamic(() => import('./bank-balances-chart').then(m => m.BankBalancesChart), { ssr: false });
const LatestBankTransactions = dynamic(() => import('./latest-bank-transactions').then(m => m.LatestBankTransactions), { ssr: false });

export function Dashboard() {
  const { openDialog } = useDialog();
  const [recentCustomers, setRecentCustomers] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        let data: any = [];
        if (!response.ok) {
          const errBody = await response.json().catch(() => null);
          throw new Error(errBody?.error || response.statusText || 'Failed to fetch customers');
        }

        data = await response.json();

        // Sort by creation date (most recent first) and take top 5
        const sorted = Array.isArray(data)
          ? data
            .sort((a: any, b: any) => {
              const dateA = new Date(a.createdAt || 0).getTime();
              const dateB = new Date(b.createdAt || 0).getTime();
              return dateB - dateA;
            })
            .slice(0, 5)
          : [];

        setRecentCustomers(sorted);
      } catch (error) {
        console.error('Error fetching recent customers:', error);
        setRecentCustomers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentCustomers();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline text-white">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => openDialog('calendar-modal' as any)} variant="secondary">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList className="bg-white/10 p-1 border border-white/20">
          <TabsTrigger value="financial" className="data-[state=active]:bg-primary data-[state=active]:text-white text-slate-300">Financial Overview</TabsTrigger>
          <TabsTrigger value="banking" className="data-[state=active]:bg-primary data-[state=active]:text-white text-slate-300">Banking Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          {/* 1. Top Section: Stats Row */}
          <StatsRow />

          {/* 2. Unified Grid Section */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            {/* Left Column: Charts and Main Lists (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Financial Health Chart */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="font-headline text-white text-xl">Financial Health</CardTitle>
                    <CardDescription className="text-slate-400">Chart of Accounts Balances by Account Type</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>

              {/* Recent Transactions List */}
              <RecentTransactions />

              {/* Newly Added Users */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-headline text-white">Newly Added User</CardTitle>
                  <CardDescription className="text-slate-400">
                    Most recent customers added to the system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center text-sm text-muted-foreground py-8">Loading...</div>
                  ) : recentCustomers.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-8">No customers yet.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recentCustomers.map((customer: any, idx: number) => (
                        <div key={customer.id ?? customer.code ?? `${(customer.customerName || customer.name || 'cust')}-${idx}`} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{(customer.customerName || customer.name || "C").charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none text-white">
                              {customer.customerName || customer.name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {customer.code}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Widgets and Balances (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Daily Inflow/Outflow Trend */}
              <DailyCashFlowChart />


              {/* Account Balances Grid */}
              <AccountBalances />

              {/* Small Overview Widgets (Invoices/Bills) */}
              <div className="grid grid-cols-2 gap-4">
                <PendingInvoicesWidget />
                <UpcomingBillsWidget />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="banking" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-white/80 font-headline">Banking Performance</h3>
            <BankingStatsRow />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            {/* Banking Section: Chart & Latest Transactions */}
            <div className="col-span-1 lg:col-span-7 grid grid-cols-1 lg:grid-cols-7 gap-4">
              <BankBalancesChart />
              <LatestBankTransactions />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
