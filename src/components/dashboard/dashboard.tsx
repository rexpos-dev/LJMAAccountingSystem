
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
import { Overview } from "./overview";
import { PesoIcon } from "@/components/icons/peso-icon";
import { SummaryCards } from "./summary-cards";

export function Dashboard() {
  const [recentCustomers, setRecentCustomers] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        if (!response.ok) throw new Error('Failed to fetch customers');
        const data = await response.json();
        
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="₱45,231.89"
          change="+20.1% from last month"
          icon={PesoIcon}
        />
        <StatCard
          title="Total Expenses"
          value="₱12,876.54"
          change="-5.3% from last month"
          icon={TrendingDown}
        />
        <StatCard
          title="Net Income"
          value="₱32,355.35"
          change="+18.4% from last month"
          icon={TrendingUp}
        />
        <StatCard
          title="Cash on Hand"
          value="₱78,123.45"
          change="+12.0% from last month"
          icon={Wallet}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
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
              <div className="space-y-8">
                {recentCustomers.map((customer: any, idx: number) => (
                  <div key={customer.id ?? customer.code ?? `${(customer.customerName || customer.name || 'cust')}-${idx}` } className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{(customer.customerName || customer.name || "C").charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {customer.customerName || customer.name || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {customer.id}
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
