import type { TransactionRow } from "@/lib/supabase/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";

interface TransactionTableProps {
  transactions: TransactionRow[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  if (!transactions.length) {
    return (
      <div className="panel flex min-h-[240px] items-center justify-center p-8">
        <div className="text-center">
          <p className="surface-label">No transactions</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-100">Nothing matches these filters yet.</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">Try broadening the date range, merchant, or category selection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full">
          <thead className="bg-slate-900/90">
            <tr className="text-left text-xs uppercase tracking-[0.22em] text-slate-500">
              <th className="px-6 py-4 font-semibold">Merchant</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className={`border-t border-slate-800 transition hover:bg-indigo-500/6 ${
                  index % 2 === 0 ? "bg-slate-950/30" : "bg-slate-900/55"
                }`}
              >
                <td className="px-6 py-4 font-semibold text-slate-100">{transaction.merchant}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{transaction.category}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{transaction.description}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{formatDate(transaction.date)}</td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-slate-100">{formatCurrency(Number(transaction.amount))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 p-4 md:hidden">
        {transactions.map((transaction) => (
          <article
            key={transaction.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold text-slate-100">{transaction.merchant}</h4>
                <p className="mt-1 text-sm text-slate-400">{transaction.category}</p>
              </div>
              <p className="text-right text-sm font-semibold text-slate-100">{formatCurrency(Number(transaction.amount))}</p>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">{transaction.description}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{formatDate(transaction.date)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
