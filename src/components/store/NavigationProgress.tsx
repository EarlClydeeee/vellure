'use client';

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(20);

    const mid = setTimeout(() => setProgress(70), 150);
    const done = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 250);
    }, 400);

    return () => {
      clearTimeout(mid);
      clearTimeout(done);
    };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 z-[60] h-0.5 bg-vellure-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      )}
    </AnimatePresence>
  );
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
