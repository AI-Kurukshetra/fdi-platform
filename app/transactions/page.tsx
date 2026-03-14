import Link from "next/link";
import TransactionTable from "@/components/tables/TransactionTable";
import DashboardShell from "@/components/ui/DashboardShell";
import { getSummaryMetrics } from "@/lib/analytics/spending";
import { getCategories, getTransactionsForUser, requireUser } from "@/lib/supabase/queries";
import { formatCurrency } from "@/lib/utils/format";

interface TransactionsPageProps {
  searchParams?: {
    category?: string;
    from?: string;
    merchant?: string;
    to?: string;
  };
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const { user } = await requireUser();
  const filters = {
    category: searchParams?.category || undefined,
    from: searchParams?.from || undefined,
    merchant: searchParams?.merchant || undefined,
    to: searchParams?.to || undefined
  };

  const [transactions, categories] = await Promise.all([getTransactionsForUser(user.id, filters), getCategories()]);
  const summary = getSummaryMetrics(transactions);

  return (
    <DashboardShell
      title="Transactions"
      description="Explore the ledger with calmer spacing, stronger contrast, and fast filtering across merchant, category, and date ranges."
      userEmail={user.email ?? "authenticated user"}
    >
      <div className="page-grid">
        <section className="panel p-6">
          <div className="flex flex-col gap-5">
            <div>
              <p className="surface-label">Filters</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-100">Refine transaction activity</h3>
            </div>

            <form className="grid gap-4 xl:grid-cols-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-200">Merchant</span>
                <input
                  name="merchant"
                  defaultValue={searchParams?.merchant ?? ""}
                  placeholder="Amazon, Uber, Starbucks..."
                  className="field"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-200">Category</span>
                <select
                  name="category"
                  defaultValue={searchParams?.category ?? ""}
                  className="field"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-200">From</span>
                <input
                  name="from"
                  type="date"
                  defaultValue={searchParams?.from ?? ""}
                  className="field"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-200">To</span>
                <input
                  name="to"
                  type="date"
                  defaultValue={searchParams?.to ?? ""}
                  className="field"
                />
              </label>

              <div className="flex flex-wrap gap-3 xl:col-span-4">
                <button type="submit" className="button-primary">
                  Apply filters
                </button>
                <Link href="/transactions" className="button-secondary">
                  Reset
                </Link>
              </div>
            </form>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <article className="panel p-6">
            <p className="surface-label">Visible transactions</p>
            <p className="metric-value mt-4">{transactions.length}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">Current result set after the active filters are applied.</p>
          </article>
          <article className="panel p-6">
            <p className="surface-label">Filtered spend</p>
            <p className="metric-value mt-4">{formatCurrency(summary.totalSpend)}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">Useful for ad hoc reviews across merchants, dates, or categories.</p>
          </article>
          <article className="panel p-6">
            <p className="surface-label">Average size</p>
            <p className="metric-value mt-4">{formatCurrency(summary.averageTransaction)}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">Average transaction value inside the current ledger slice.</p>
          </article>
        </section>

        <section>
          <div className="mb-4">
            <p className="surface-label">Ledger</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-100">Transaction history</h3>
          </div>
          <TransactionTable transactions={transactions} />
        </section>
      </div>
    </DashboardShell>
  );
}
