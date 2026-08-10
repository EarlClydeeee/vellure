import { Metadata } from 'next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getCustomers } from '@/lib/services/customers';
import { formatPrice } from '@/lib/format-price';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Customers - Vellure Admin',
};

export default async function AdminCustomersPage() {
  const result = await getCustomers();
  const customers = result.success ? result.data : [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Customers</h1>
      <div className="relative -mx-4 w-[calc(100%+2rem)] overflow-x-auto rounded-md border sm:mx-0 sm:w-full">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Purchases</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.fullName ?? '—'}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.contactNumber ?? '—'}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>{formatPrice(customer.totalPurchaseAmount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={customer.accountStatus === 'Active' ? 'default' : 'secondary'}
                    >
                      {customer.accountStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
