import { ShopHeroSkeleton } from '@/components/store/skeletons/ShopHeroSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function StoreLoading() {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-10 w-full rounded-none bg-vellure-text/20" />

      <ShopHeroSkeleton />

      <div className="border-y border-sky-100 bg-vellure-surface py-10">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-b px-4 py-8">
        <div className="container mx-auto flex justify-center gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-16 w-16 rounded-full md:h-20 md:w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="min-h-[280px] rounded-2xl md:min-h-[360px]" />
          <div className="flex flex-col gap-4">
            <Skeleton className="min-h-[160px] rounded-2xl" />
            <Skeleton className="min-h-[160px] rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="border-y bg-vellure-surface py-6">
        <div className="container mx-auto flex justify-center gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-full" />
          ))}
        </div>
      </div>

      <div className="border-b py-6">
        <div className="container mx-auto flex justify-center gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>
      </div>

      <div className="bg-vellure-primary py-14">
        <div className="container mx-auto px-4">
          <Skeleton className="mb-8 h-10 w-64 bg-white/20" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-64 shrink-0 rounded-lg bg-white/20" />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-vellure-surface py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="mx-auto mb-8 h-8 w-56" />
          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-12">
        <Skeleton className="mb-8 h-8 w-48" />
        <Skeleton className="h-[450px] w-full rounded-3xl" />
      </div>

      <div className="px-4 py-10">
        <Skeleton className="mb-6 h-8 w-52" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-72 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>

      <div className="px-4 py-12">
        <Skeleton className="mb-8 h-8 w-56" />
        <Skeleton className="h-[600px] w-full" />
      </div>

      <div className="py-12">
        <Skeleton className="mx-auto mb-8 h-8 w-72" />
        <div className="flex gap-4 overflow-hidden px-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-80 shrink-0 rounded-2xl" />
          ))}
        </div>
      </div>

      <div className="bg-vellure-surface py-12">
        <div className="container mx-auto flex flex-col items-center px-4">
          <Skeleton className="mb-4 h-12 w-12 rounded-full" />
          <Skeleton className="mb-2 h-8 w-64" />
          <Skeleton className="mb-6 h-4 w-80" />
          <Skeleton className="h-12 w-full max-w-md rounded-full" />
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Skeleton className="mx-auto mb-8 h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Skeleton className="mx-auto mb-8 h-8 w-72" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-14 w-full rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-40 w-full bg-vellure-cta/30" />
    </div>
  );
}
