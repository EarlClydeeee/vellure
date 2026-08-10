const COMPARE_KEY = 'vellure_compare';
const MAX_COMPARE = 4;

export function getCompareList(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE) : [];
  } catch {
    return [];
  }
}

export function addToCompare(productId: string): string[] {
  const list = getCompareList().filter((id) => id !== productId);
  list.unshift(productId);
  const trimmed = list.slice(0, MAX_COMPARE);
  if (typeof window !== 'undefined') {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(trimmed));
    window.dispatchEvent(new Event('compare-updated'));
  }
  return trimmed;
}

export function removeFromCompare(productId: string): string[] {
  const list = getCompareList().filter((id) => id !== productId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('compare-updated'));
  }
  return list;
}

export function clearCompare() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(COMPARE_KEY);
    window.dispatchEvent(new Event('compare-updated'));
  }
}
