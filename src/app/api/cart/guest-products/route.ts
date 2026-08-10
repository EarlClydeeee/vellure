import { NextResponse } from 'next/server';
import { getProductsByIds } from '@/lib/services/products';

export async function POST(request: Request) {
  const body = await request.json();
  const productIds = body.productIds as string[];

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return NextResponse.json({ products: [] });
  }

  const result = await getProductsByIds(productIds);
  return NextResponse.json({
    products: result.success ? result.data : [],
  });
}
