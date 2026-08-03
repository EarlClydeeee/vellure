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

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Customers - Vellure Admin',
};

export default async function AdminCustomersPage() {
  const result = await getCustomers();
  const customers = result.success ? result.data : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Customers</h1>
      <div className="relative w-full overflow-auto rounded-md border">
        <Table>
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
                  <TableCell>${customer.totalPurchaseAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="default">Active</Badge>
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
