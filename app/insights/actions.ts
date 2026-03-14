"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateInsightsFromTransactions } from "@/lib/analytics/insights";
import { createClient } from "@/lib/supabase/server";
import type { TransactionRow } from "@/lib/supabase/types";

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
  const insights = generateInsightsFromTransactions(typedTransactions).map((insight) => ({
    user_id: user.id,
    type: insight.type,
    content: insight.content
  }));

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
