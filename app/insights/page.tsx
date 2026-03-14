import { refreshInsightsAction } from "@/app/insights/actions";
import DashboardShell from "@/components/ui/DashboardShell";
import InsightCard from "@/components/ui/InsightCard";
import FormButton from "@/components/ui/FormButton";
import { detectRecurringPayments, getCategorySpending, getMonthlySpending } from "@/lib/analytics/spending";
import { normalizeInsights } from "@/lib/analytics/insights";
import { getInsightsForUser, getTransactionsForUser, requireUser } from "@/lib/supabase/queries";
import { formatCurrency, formatMonthLabel } from "@/lib/utils/format";

export default async function InsightsPage() {
  const { user } = await requireUser();
  const [transactions, storedInsights] = await Promise.all([getTransactionsForUser(user.id, {}, 200), getInsightsForUser(user.id)]);
  const insights = normalizeInsights(storedInsights, transactions);
  const recurringPayments = detectRecurringPayments(transactions).slice(0, 4);
  const topCategories = getCategorySpending(transactions).slice(0, 3);
  const monthlySpending = getMonthlySpending(transactions, 3);
  const latestMonth = monthlySpending.at(-1);

  return (
    <DashboardShell
      title="Insights"
      description="Behavioral signals turn your transaction feed into clean, readable summaries about category pressure and repeat merchant behavior."
      userEmail={user.email ?? "authenticated user"}
      actions={
        <form action={refreshInsightsAction}>
          <FormButton label="Refresh insights" pendingLabel="Refreshing..." variant="secondary" />
        </form>
      }
    >
      <div className="page-grid">
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="panel relative overflow-hidden p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-indigo-500/12 via-purple-500/10 to-blue-500/10" />
            <div className="relative">
              <p className="surface-label">Narrative summary</p>
              <h3 className="mt-3 text-3xl font-semibold text-slate-100">Your spend story is getting clearer.</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                We are combining monthly pacing, leading categories, and recurring merchants to surface lightweight
                guidance that feels more like a fintech cockpit than a spreadsheet.
              </p>
            </div>
          </article>

          <article className="panel p-6">
            <p className="surface-label">Recurring payments</p>
            <p className="metric-value mt-4">{recurringPayments.length}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">Detected merchants with repeated charge behavior over multiple months.</p>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <article className="panel p-6">
            <p className="surface-label">Top category</p>
            <p className="metric-value mt-4">{topCategories[0]?.label ?? "Not enough data"}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {topCategories[0]
                ? `${formatCurrency(topCategories[0].value)} total spend across ${topCategories[0].transactions} transactions.`
                : "Seed transaction data to unlock category-level insights."}
            </p>
          </article>
          <article className="panel p-6">
            <p className="surface-label">Latest month</p>
            <p className="metric-value mt-4">{latestMonth ? formatCurrency(latestMonth.value) : formatCurrency(0)}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {latestMonth
                ? `${formatMonthLabel(latestMonth.label)} spend summarized from ${latestMonth.transactions} transactions.`
                : "Monthly trend data becomes available after transactions are loaded."}
            </p>
          </article>
          <article className="panel p-6">
            <p className="surface-label">Insight cards</p>
            <p className="metric-value mt-4">{insights.length}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">Auto-generated observations are refreshed from your current transaction set.</p>
          </article>
        </section>

        <section className="grid gap-4 xl:grid-cols-4">
          {insights.map((insight, index) => (
            <InsightCard key={`${insight.type}-${index}`} type={insight.type} content={insight.content} createdAt={insight.created_at} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <div>
              <p className="surface-label">Recurring merchants</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-100">Likely subscriptions</h3>
            </div>

            <div className="grid gap-4">
              {recurringPayments.length ? (
                recurringPayments.map((payment) => (
                  <article key={`${payment.merchant}-${payment.category}`} className="panel p-5">
                    <p className="surface-label">{payment.category}</p>
                    <h4 className="mt-3 text-xl font-semibold text-slate-100">{payment.merchant}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Around {formatCurrency(payment.averageAmount)} per charge with {payment.count} repeats in the dataset.
                    </p>
                  </article>
                ))
              ) : (
                <article className="panel p-5">
                  <p className="surface-label">No repeat charges yet</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">Recurring payment detection gets sharper after multiple months of transactions are present.</p>
                </article>
              )}
            </div>
          </div>

          <div className="panel p-5">
            <p className="surface-label">Category ranking</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-100">Your biggest cost centers</h3>

            <div className="mt-6 space-y-4">
              {topCategories.length ? (
                topCategories.map((category, index) => (
                  <div key={category.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">#{index + 1}</p>
                        <h4 className="mt-2 text-xl font-semibold text-slate-100">{category.label}</h4>
                      </div>
                      <p className="text-right text-lg font-semibold text-slate-100">{formatCurrency(category.value)}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{category.transactions} transactions are contributing to this spend bucket.</p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-400">Run the seed script or add transactions to see ranked spending categories here.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
