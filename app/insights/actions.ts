"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TransactionRow } from "@/lib/supabase/types";

type MonthlyInsightInsert = {
  created_at: string;
  id: string;
  month: string;
  top_category: string;
  total_expense: number;
  total_income: number;
  user_id: string;
};

function buildMonthlyInsights(userId: string, transactions: TransactionRow[]): MonthlyInsightInsert[] {
  const monthly = new Map<
    string,
    {
      categoryTotals: Map<string, number>;
      totalExpense: number;
      totalIncome: number;
    }
  >();

  for (const transaction of transactions) {
    const month = `${transaction.date.slice(0, 7)}-01`;
    const bucket = monthly.get(month) ?? {
      categoryTotals: new Map<string, number>(),
      totalExpense: 0,
      totalIncome: 0
    };

    const amount = Number(transaction.amount);

    if (transaction.type === "credit") {
      bucket.totalIncome += amount;
    } else {
      bucket.totalExpense += amount;

      if (transaction.category_id) {
        bucket.categoryTotals.set(
          transaction.category_id,
          (bucket.categoryTotals.get(transaction.category_id) ?? 0) + amount
        );
      }
    }

    monthly.set(month, bucket);
  }

  return Array.from(monthly.entries())
    .sort(([left], [right]) => right.localeCompare(left))
    .slice(0, 4)
    .flatMap(([month, bucket], index): MonthlyInsightInsert[] => {
      const topCategory =
        Array.from(bucket.categoryTotals.entries()).sort((left, right) => right[1] - left[1])[0]?.[0] ??
        transactions.find((transaction) => transaction.category_id)?.category_id;

      if (!topCategory) {
        return [];
      }

      return [
        {
          id: randomUUID(),
          user_id: userId,
          month,
          total_income: Number(bucket.totalIncome.toFixed(2)),
          total_expense: Number(bucket.totalExpense.toFixed(2)),
          top_category: topCategory,
          created_at: new Date(Date.now() - index * 30_000).toISOString()
        }
      ];
    });
}

export async function refreshInsightsAction() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (transactionsError) {
    throw new Error(transactionsError.message);
  }

  const typedTransactions = (transactions ?? []) as TransactionRow[];
  const insights = buildMonthlyInsights(user.id, typedTransactions);

  const { error: deleteError } = await supabase.from("insights").delete().eq("user_id", user.id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (insights.length) {
    const { error: insertError } = await supabase.from("insights").insert(insights);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/insights");
}
