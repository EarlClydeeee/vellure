import { getAllReturns } from '@/lib/services/returns';
import { getOrderById } from '@/lib/services/orders';
import { ReturnActions } from '@/components/admin/ReturnActions';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function AdminReturnsPage() {
  const result = await getAllReturns();
  const returns = result.success ? result.data : [];

  const withOrders = await Promise.all(
    returns.map(async (r) => {
      const orderResult = await getOrderById(r.orderId);
      const orderNumber =
        orderResult.success && orderResult.data ? orderResult.data.orderNumber : undefined;
      return { ...r, orderNumber };
    })
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Return Requests</h1>

      {withOrders.length === 0 ? (
        <p className="text-muted-foreground">No return requests yet.</p>
      ) : (
        <div className="space-y-4">
          {withOrders.map((r) => (
            <div key={r.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">
                  Order #{r.orderNumber ?? r.orderId.slice(0, 8)}
                </span>
                <Badge variant="outline">{r.status}</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString('en-PH')}
                </span>
              </div>
              <p className="text-sm">{r.reason}</p>
              {r.adminNotes && (
                <p className="text-sm text-muted-foreground">Notes: {r.adminNotes}</p>
              )}
              {r.status === 'requested' && <ReturnActions returnId={r.id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
