import SpendingChart from "@/components/charts/SpendingChart";
import TransactionTable from "@/components/tables/TransactionTable";
import DashboardShell from "@/components/ui/DashboardShell";
import InsightCard from "@/components/ui/InsightCard";
import StatCard from "@/components/ui/StatCard";
import { detectRecurringPayments, getCategorySpending, getMonthlySpending, getSummaryMetrics } from "@/lib/analytics/spending";
import { normalizeInsights } from "@/lib/analytics/insights";
import { getInsightsForUser, getPrimaryAccountBalance, getTransactionsForUser, requireUser } from "@/lib/supabase/queries";
import { compactNumber, formatCurrency } from "@/lib/utils/format";

export default async function DashboardPage() {
  const { user } = await requireUser();
  const [transactions, storedInsights, balance] = await Promise.all([
    getTransactionsForUser(user.id, {}, 150),
    getInsightsForUser(user.id, 4),
    getPrimaryAccountBalance(user.id)
  ]);

  const summary = getSummaryMetrics(transactions);
  const categorySpending = getCategorySpending(transactions).slice(0, 6);
  const monthlySpending = getMonthlySpending(transactions);
  const recurringPayments = detectRecurringPayments(transactions).slice(0, 3);
  const insights = normalizeInsights(storedInsights, transactions);

  return (
    <DashboardShell
      title="Dashboard"
      description="A modern overview of your spending velocity, recurring outflows, and the categories that deserve attention."
      userEmail={user.email ?? "authenticated user"}
    >
      <div className="page-grid">
        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <article className="panel relative overflow-hidden p-6 lg:p-7">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-indigo-500/14 via-purple-500/12 to-blue-500/10" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="max-w-2xl">
                <p className="surface-label">Live cashflow snapshot</p>
                <h3 className="mt-3 text-3xl font-semibold leading-tight text-slate-100 lg:text-4xl">
                  {formatCurrency(summary.totalSpend)} spent across your active debit activity.
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
                  Category momentum, monthly pace, and recurring merchants are surfaced below so the dashboard answers
                  “where is my money going?” in one pass.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="panel-muted p-4">
                  <p className="surface-label">Transactions</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-100">{summary.totalTransactions}</p>
                </div>
                <div className="panel-muted p-4">
                  <p className="surface-label">This month</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-100">{formatCurrency(summary.thisMonthSpend)}</p>
                </div>
                <div className="panel-muted p-4">
                  <p className="surface-label">Trend</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-100">
                    {summary.trendPercentage >= 0 ? "+" : "-"}
                    {Math.abs(summary.trendPercentage).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-6">
            <article className="panel p-6">
              <p className="surface-label">Balance pulse</p>
              <p className="metric-value mt-4">{formatCurrency(balance)}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">Primary account balance available for a fast liquidity check before reviewing outflows.</p>
            </article>
            <article className="panel p-6">
              <p className="surface-label">Leading category</p>
              <p className="mt-4 text-2xl font-semibold text-slate-100">{summary.topCategory}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">Your highest spend category right now based on normalized debit transactions.</p>
            </article>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-4">
          <StatCard
            eyebrow="Total spend"
            value={formatCurrency(summary.totalSpend)}
            detail={`${summary.totalTransactions} transactions tracked across your current dataset.`}
          />
          <StatCard
            eyebrow="This month"
            value={formatCurrency(summary.thisMonthSpend)}
            detail={`${summary.trendPercentage >= 0 ? "Up" : "Down"} ${Math.abs(summary.trendPercentage).toFixed(1)}% versus last month.`}
          />
          <StatCard
            eyebrow="Average transaction"
            value={formatCurrency(summary.averageTransaction)}
            detail={`Top category right now is ${summary.topCategory}.`}
          />
          <StatCard
            eyebrow="Account balance"
            value={formatCurrency(balance)}
            detail="Primary account balance pulled from Supabase for a quick liquidity read." 
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <SpendingChart
            title="Where your money goes"
            subtitle="Ranked category totals help surface the spending buckets driving the month."
            data={categorySpending}
            variant="category"
          />
          <SpendingChart
            title="How spending moves over time"
            subtitle="Monthly spend trendline across the last twelve months for faster pattern recognition."
            data={monthlySpending}
            variant="monthly"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div>
              <p className="surface-label">Recent activity</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-100">Latest transactions</h3>
            </div>
            <TransactionTable transactions={transactions.slice(0, 8)} />
          </div>

          <div className="space-y-4">
            <div>
              <p className="surface-label">Recurring payments</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-100">Repeat merchant activity</h3>
            </div>

            <div className="grid gap-4">
              {recurringPayments.length ? (
                recurringPayments.map((payment) => (
                  <article key={`${payment.merchant}-${payment.category}`} className="panel group p-5">
                    <p className="surface-label">{payment.category}</p>
                    <h4 className="mt-3 text-xl font-semibold text-slate-100">{payment.merchant}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      About {formatCurrency(payment.averageAmount)} per charge across {compactNumber(payment.count)} tracked payments.
                    </p>
                  </article>
                ))
              ) : (
                <article className="panel p-5">
                  <p className="surface-label">Recurring scan</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">Seed more than a few months of transactions to detect subscription-like merchant patterns.</p>
                </article>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <p className="surface-label">AI-style insights</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-100">Generated takeaways</h3>
          </div>

          <div className="grid gap-4 xl:grid-cols-4">
            {insights.map((insight, index) => (
              <InsightCard
                key={`${insight.type}-${index}`}
                type={insight.type}
                content={insight.content}
                createdAt={insight.created_at}
              />
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
