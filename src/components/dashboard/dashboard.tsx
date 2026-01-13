
"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
const SummaryCards = dynamic(() => import('./summary-cards').then(m => m.SummaryCards), { ssr: false });
const FinancialDonut = dynamic(() => import('./financial-donut').then(m => m.FinancialDonut), { ssr: false });
const CalendarCard = dynamic(() => import('./calendar-card').then(m => m.CalendarCard), { ssr: false });

export function Dashboard() {
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
      <h2 className="text-3xl font-bold tracking-tight font-headline text-white">Dashboard</h2>
      <SummaryCards />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <div className="col-span-1 lg:col-span-3 h-full">
          <CalendarCard />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Financial Summary</CardTitle>
            <CardDescription>
              Revenue, Expenses, and Net Income breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialDonut />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Newly Added Customers</CardTitle>
            <CardDescription>
              Most recent customers added to the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center text-sm text-muted-foreground py-8">Loading...</div>
            ) : recentCustomers.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">No customers yet.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {recentCustomers.map((customer: any, idx: number) => (
                  <div key={customer.id ?? customer.code ?? `${(customer.customerName || customer.name || 'cust')}-${idx}`} className="flex items-center gap-3 p-3 rounded-lg border">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{(customer.customerName || customer.name || "C").charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
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
    </div>
  );
}
