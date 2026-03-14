import type { InsightRow, TransactionRow } from "@/lib/supabase/types";
import { formatCurrency } from "@/lib/utils/format";
import { detectRecurringPayments, getCategorySpending, getMonthlySpending } from "@/lib/analytics/spending";

export interface GeneratedInsight {
  content: string;
  type: string;
}

export function generateInsightsFromTransactions(transactions: TransactionRow[]): GeneratedInsight[] {
  if (!transactions.length) {
    return [
      {
        type: "getting-started",
        content: "Add or seed transactions to unlock spending insights, recurring payment detection, and trend tracking."
      }
    ];
  }

  const categorySpending = getCategorySpending(transactions);
  const monthlySpending = getMonthlySpending(transactions, 2);
  const recurringPayments = detectRecurringPayments(transactions);
  const latestMonth = monthlySpending.at(-1)?.value ?? 0;
  const previousMonth = monthlySpending.at(-2)?.value ?? 0;
  const trendDelta = latestMonth - previousMonth;

  const insights: GeneratedInsight[] = [];

  if (categorySpending[0]) {
    const topCategory = categorySpending[0];
    insights.push({
      type: "category",
      content: `${topCategory.label} is your biggest spend category at ${formatCurrency(topCategory.value)} across ${topCategory.transactions} transactions.`
    });
  }

  if (recurringPayments[0]) {
    const recurring = recurringPayments[0];
    insights.push({
      type: "recurring",
      content: `${recurring.merchant} looks like a recurring charge at roughly ${formatCurrency(recurring.averageAmount)} per payment.`
    });
  }

  insights.push({
    type: "trend",
    content:
      trendDelta >= 0
        ? `Monthly spending increased by ${formatCurrency(Math.abs(trendDelta))} compared with the previous month.`
        : `Monthly spending decreased by ${formatCurrency(Math.abs(trendDelta))} compared with the previous month.`
  });

  if (transactions.length >= 20) {
    const weekendSpend = transactions
      .filter((transaction) => {
        if (transaction.type === "credit") {
          return false;
        }

        const day = new Date(transaction.date).getDay();
        return day === 0 || day === 6;
      })
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    insights.push({
      type: "behavior",
      content: `Weekend purchases account for ${formatCurrency(weekendSpend)} of your tracked spending activity.`
    });
  }

  return insights.slice(0, 4);
}

export function normalizeInsights(
  storedInsights: InsightRow[],
  fallbackTransactions: TransactionRow[]
): Array<Pick<InsightRow, "content" | "created_at" | "type">> {
  if (storedInsights.length) {
    return storedInsights;
  }

  const timestamp = new Date().toISOString();
  return generateInsightsFromTransactions(fallbackTransactions).map((insight) => ({
    ...insight,
    created_at: timestamp
  }));
}
