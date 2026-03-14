import type { TransactionRow } from "@/lib/supabase/types";

export interface ChartDatum {
  label: string;
  value: number;
  transactions: number;
}

export interface SummaryMetrics {
  averageTransaction: number;
  thisMonthSpend: number;
  topCategory: string;
  totalSpend: number;
  totalTransactions: number;
  trendPercentage: number;
}

export interface RecurringPayment {
  averageAmount: number;
  category: string;
  count: number;
  merchant: string;
}

function isSpendTransaction(transaction: TransactionRow) {
  return transaction.type !== "credit";
}

function getSpendAmount(transaction: TransactionRow) {
  return isSpendTransaction(transaction) ? Number(transaction.amount) : 0;
}

function sumAmounts(transactions: TransactionRow[]) {
  return transactions.reduce((total, transaction) => total + getSpendAmount(transaction), 0);
}

export function getCategorySpending(transactions: TransactionRow[]): ChartDatum[] {
  const grouped = transactions.reduce<Map<string, ChartDatum>>((map, transaction) => {
    if (!isSpendTransaction(transaction)) {
      return map;
    }

    const existing = map.get(transaction.category) ?? {
      label: transaction.category,
      value: 0,
      transactions: 0
    };

    existing.value += getSpendAmount(transaction);
    existing.transactions += 1;
    map.set(transaction.category, existing);
    return map;
  }, new Map());

  return Array.from(grouped.values()).sort((a, b) => b.value - a.value);
}

export function getMonthlySpending(transactions: TransactionRow[], months = 12): ChartDatum[] {
  const monthMap = new Map<string, ChartDatum>();
  const today = new Date();

  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    const key = date.toISOString().slice(0, 7);
    monthMap.set(key, {
      label: key,
      value: 0,
      transactions: 0
    });
  }

  for (const transaction of transactions) {
    if (!isSpendTransaction(transaction)) {
      continue;
    }

    const key = transaction.date.slice(0, 7);
    const current = monthMap.get(key);

    if (!current) {
      continue;
    }

    current.value += getSpendAmount(transaction);
    current.transactions += 1;
  }

  return Array.from(monthMap.values());
}

export function getSummaryMetrics(transactions: TransactionRow[]): SummaryMetrics {
  const totalSpend = sumAmounts(transactions);
  const totalTransactions = transactions.length;
  const averageTransaction = totalTransactions ? totalSpend / totalTransactions : 0;
  const categorySpending = getCategorySpending(transactions);
  const monthlySpending = getMonthlySpending(transactions, 2);
  const thisMonthSpend = monthlySpending.at(-1)?.value ?? 0;
  const previousMonthSpend = monthlySpending.at(-2)?.value ?? 0;
  const trendPercentage =
    previousMonthSpend === 0 ? (thisMonthSpend > 0 ? 100 : 0) : ((thisMonthSpend - previousMonthSpend) / previousMonthSpend) * 100;

  return {
    averageTransaction,
    thisMonthSpend,
    topCategory: categorySpending[0]?.label ?? "No category yet",
    totalSpend,
    totalTransactions,
    trendPercentage
  };
}

export function detectRecurringPayments(transactions: TransactionRow[]): RecurringPayment[] {
  const grouped = transactions.reduce<Map<string, TransactionRow[]>>((map, transaction) => {
    if (!isSpendTransaction(transaction)) {
      return map;
    }

    const key = `${transaction.merchant}::${transaction.category}`;
    const existing = map.get(key) ?? [];
    existing.push(transaction);
    map.set(key, existing);
    return map;
  }, new Map());

  return Array.from(grouped.entries())
    .map(([key, entries]) => {
      const [merchant, category] = key.split("::");
      const sorted = entries.sort((a, b) => a.date.localeCompare(b.date));

      if (sorted.length < 3) {
        return null;
      }

      const averageAmount = sumAmounts(sorted) / sorted.length;
      const firstDate = new Date(sorted[0].date).getTime();
      const lastDate = new Date(sorted.at(-1)!.date).getTime();
      const spanDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);

      if (spanDays < 45) {
        return null;
      }

      return {
        averageAmount,
        category,
        count: sorted.length,
        merchant
      };
    })
    .filter((value): value is RecurringPayment => Boolean(value))
    .sort((a, b) => b.count - a.count || b.averageAmount - a.averageAmount);
}
