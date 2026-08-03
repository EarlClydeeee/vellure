import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getOrderById } from '@/lib/services/orders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusSelect } from '@/components/admin/StatusSelect';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Order Details - Vellure Admin',
};

interface Props {
  params: Promise<{ id: string }>;
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'Completed':
      return 'default' as const;
    case 'Pending':
      return 'secondary' as const;
    case 'Cancelled':
      return 'destructive' as const;
    default:
      return 'outline' as const;
  }
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getOrderById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const order = result.data;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>{' '}
              <span className="font-medium">{order.fullName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>{' '}
              <span className="font-medium">{order.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Contact:</span>{' '}
              <span className="font-medium">{order.contactNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Delivery Address:</span>{' '}
              <span className="font-medium">{order.deliveryAddress}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Payment Method:</span>{' '}
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Date:</span>{' '}
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {order.notes && (
              <div>
                <span className="text-muted-foreground">Notes:</span>{' '}
                <span className="font-medium">{order.notes}</span>
              </div>
            )}
            <div className="pt-2">
              <span className="text-muted-foreground">Update Status:</span>
              <div className="mt-1">
                <StatusSelect orderId={order.id} currentStatus={order.status} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>${item.productPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-end">
            <div className="space-y-1 text-right">
              <div className="text-sm text-muted-foreground">
                Subtotal: <span className="font-medium text-foreground">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="text-lg font-bold">
                Total: ${order.total.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
