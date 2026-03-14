import { redirect } from "next/navigation";
import type { DashboardInsight } from "@/lib/analytics/insights";
import { createClient } from "@/lib/supabase/server";
import type { CategoryRow, TransactionRow } from "@/lib/supabase/types";
import { formatCurrency, formatMonthLabel } from "@/lib/utils/format";

type TransactionFilters = {
  category?: string;
  from?: string;
  merchant?: string;
  to?: string;
};

type RawTransactionRow = {
  amount: number;
  category_id: string | null;
  categories: { name: string } | null;
  created_at: string;
  date: string;
  description: string;
  id: string;
  is_recurring: boolean | null;
  merchant_name: string | null;
  type: string | null;
  user_id: string;
};

type RawInsightRow = {
  categories: { name: string } | null;
  created_at: string;
  id: string;
  month: string;
  top_category: string;
  total_expense: number;
  total_income: number;
  user_id: string;
};

export async function requireUser() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function getTransactionsForUser(
  userId: string,
  filters: TransactionFilters = {},
  limit?: number
) {
  const supabase = createClient();
  let categoryIds: string[] | null = null;

  if (filters.category) {
    const { data: categoryMatches, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", filters.category);

    if (categoryError) {
      throw new Error(categoryError.message);
    }

    categoryIds = (categoryMatches ?? []).map((category) => category.id);

    if (!categoryIds.length) {
      return [];
    }
  }

  let query = supabase
    .from("transactions")
    .select("id, user_id, amount, description, date, created_at, type, is_recurring, merchant_name, category_id, categories(name)")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (categoryIds) {
    query = query.in("category_id", categoryIds);
  }

  if (filters.merchant) {
    query = query.ilike("merchant_name", `%${filters.merchant}%`);
  }

  if (filters.from) {
    query = query.gte("date", filters.from);
  }

  if (filters.to) {
    query = query.lte("date", filters.to);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RawTransactionRow[]).map((transaction) => ({
    id: transaction.id,
    user_id: transaction.user_id,
    amount: Number(transaction.amount),
    description: transaction.description ?? "",
    date: transaction.date,
    created_at: transaction.created_at,
    merchant: transaction.merchant_name ?? "Unknown merchant",
    merchant_name: transaction.merchant_name ?? "Unknown merchant",
    category: transaction.categories?.name ?? "Uncategorized",
    category_id: transaction.category_id,
    type: transaction.type,
    is_recurring: transaction.is_recurring
  })) as TransactionRow[];
}

export async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CategoryRow[];
}

export async function getInsightsForUser(userId: string, limit?: number) {
  const supabase = createClient();
  let query = supabase
    .from("insights")
    .select("id, user_id, month, total_income, total_expense, top_category, created_at, categories(name)")
    .eq("user_id", userId)
    .order("month", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RawInsightRow[]).map((insight): DashboardInsight => {
    const categoryName = insight.categories?.name ?? "Uncategorized";
    const income = Number(insight.total_income ?? 0);
    const expense = Number(insight.total_expense ?? 0);

    return {
      type: `${categoryName} spotlight`,
      content: `${formatMonthLabel(insight.month)} closed with ${formatCurrency(expense)} in expenses and ${formatCurrency(income)} in income. Top category: ${categoryName}.`,
      created_at: insight.created_at
    };
  });
}

export async function getPrimaryAccountBalance(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("balance")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.balance ?? 0;
}
