import type { Transaction, TransactionType } from '../types';

export interface Totals {
  revenu: number;
  depense: number;
  savings: number;
  balance: number;
  count: number;
  lastCategory: string;
}

export function calculateTotals(transactions: Transaction[]): Totals {
  const totals: Totals = { revenu: 0, depense: 0, savings: 0, balance: 0, count: transactions.length, lastCategory: 'Aucune' };

  if (transactions.length > 0) {
    totals.lastCategory = transactions[0].category || 'Aucune';
  }

  for (const t of transactions) {
    if (t.type === 'revenu') totals.revenu += Number(t.amount);
    else if (t.type === 'epargne') totals.savings += Number(t.amount);
    else totals.depense += Number(t.amount);
  }

  totals.balance = totals.revenu - totals.depense - totals.savings;
  return totals;
}

export function filterByType(transactions: Transaction[], type: TransactionType): Transaction[] {
  return transactions.filter(t => t.type === type);
}

export interface CategorySlice {
  category: string;
  total: number;
}

export function groupByCategory(transactions: Transaction[]): CategorySlice[] {
  const map = new Map<string, number>();
  for (const t of transactions) {
    const key = t.category || 'Autre';
    map.set(key, (map.get(key) ?? 0) + Number(t.amount));
  }
  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

/** Caps categorical slices at `max` slots, folding the smallest remainder into "Autres". */
export function foldTopCategories(slices: CategorySlice[], max = 8): CategorySlice[] {
  if (slices.length <= max) return slices;
  const head = slices.slice(0, max - 1);
  const rest = slices.slice(max - 1);
  const restTotal = rest.reduce((sum, s) => sum + s.total, 0);
  return [...head, { category: 'Autres', total: restTotal }];
}

export interface MonthlyPoint {
  month: string;
  revenu: number;
  depense: number;
  epargne: number;
}

export function groupByMonth(transactions: Transaction[]): MonthlyPoint[] {
  const map = new Map<string, MonthlyPoint>();

  for (const t of transactions) {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    if (!map.has(key)) {
      map.set(key, { month: label, revenu: 0, depense: 0, epargne: 0 });
    }
    const point = map.get(key) as MonthlyPoint;
    if (t.type === 'revenu') point.revenu += Number(t.amount);
    else if (t.type === 'epargne') point.epargne += Number(t.amount);
    else point.depense += Number(t.amount);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([, value]) => value);
}
