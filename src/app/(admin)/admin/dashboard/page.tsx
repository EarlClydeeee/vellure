import { Metadata } from 'next';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle,
  Users,
  DollarSign,
} from 'lucide-react';
import { getDashboardMetrics } from '@/lib/services/dashboard';
import { SummaryCard } from '@/components/admin/SummaryCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard - Vellure Admin',
};

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export default async function AdminDashboardPage() {
  const result = await getDashboardMetrics();

  if (!result.success) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-destructive">Failed to load dashboard metrics.</p>
      </div>
    );
  }

  const metrics = result.data;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          label="Total Products"
          value={formatNumber(metrics.totalProducts)}
          icon={Package}
        />
        <SummaryCard
          label="Total Orders"
          value={formatNumber(metrics.totalOrders)}
          icon={ShoppingBag}
        />
        <SummaryCard
          label="Pending Orders"
          value={formatNumber(metrics.pendingOrders)}
          icon={Clock}
        />
        <SummaryCard
          label="Completed Orders"
          value={formatNumber(metrics.completedOrders)}
          icon={CheckCircle}
        />
        <SummaryCard
          label="Total Customers"
          value={formatNumber(metrics.totalCustomers)}
          icon={Users}
        />
        <SummaryCard
          label="Total Sales"
          value={formatCurrency(metrics.totalSalesAmount)}
          icon={DollarSign}
        />
      </div>
    </div>
  );
}
