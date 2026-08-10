'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCompareList, removeFromCompare } from '@/lib/cart/compare';

export function CompareBar() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getCompareList());
    function refresh() {
      setIds(getCompareList());
    }
    window.addEventListener('compare-updated', refresh);
    return () => window.removeEventListener('compare-updated', refresh);
  }, []);

  if (ids.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium">
          Compare ({ids.length}/4)
        </p>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              ids.forEach((id) => removeFromCompare(id));
              setIds([]);
            }}
          >
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
          <Link href="/compare">
            <Button size="sm">View Compare</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
