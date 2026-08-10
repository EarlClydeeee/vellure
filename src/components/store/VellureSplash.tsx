'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SPLASH_KEY = 'vellure-splash-shown';
const SPLASH_DURATION_MS = 1800;

export function VellureSplash() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const shown = sessionStorage.getItem(SPLASH_KEY);
    if (!shown) {
      setVisible(true);
      sessionStorage.setItem(SPLASH_KEY, 'true');
      const timer = setTimeout(() => setVisible(false), SPLASH_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-vellure-primary"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <motion.h1
            className="text-4xl font-bold tracking-[0.2em] text-white sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Vellure
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
