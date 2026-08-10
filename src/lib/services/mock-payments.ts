import type { PaymentMethod, PaymentStatus } from '@/lib/types';

export function generatePaymentReference(): string {
  return `VLR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function getInitialPaymentStatus(method: PaymentMethod): PaymentStatus {
  if (method === 'COD') return 'cod_pending';
  if (method === 'GCash' || method === 'Maya' || method === 'Card' || method === 'E-Wallet') {
    return 'pending';
  }
  return 'pending';
}

export function requiresMockPaymentPage(method: PaymentMethod): boolean {
  return method === 'GCash' || method === 'Maya' || method === 'Card' || method === 'E-Wallet';
}

export function getMockPaymentInstructions(method: PaymentMethod, reference: string, amount: number) {
  const formatted = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  if (method === 'GCash') {
    return {
      title: 'Pay with GCash',
      steps: [
        'Open your GCash app',
        `Send ${formatted} to Vellure Demo (0917-000-0000)`,
        `Use reference: ${reference}`,
        'Tap "I have paid" — admin will confirm within 24 hours',
      ],
    };
  }
  if (method === 'Maya') {
    return {
      title: 'Pay with Maya',
      steps: [
        'Open your Maya app',
        `Send ${formatted} to Vellure Demo (0918-000-0000)`,
        `Use reference: ${reference}`,
        'Admin will confirm your payment locally',
      ],
    };
  }
  return {
    title: 'Complete Payment',
    steps: [
      `Amount due: ${formatted}`,
      `Reference: ${reference}`,
      'This is a mock payment flow for demo purposes.',
    ],
  };
}
