import {
  ChartCardSkeleton,
  DashboardLoadingShell,
  MetricCardSkeleton,
  TransactionTableSkeleton
} from "@/components/ui/loading-state";
import Skeleton from "@/components/ui/skeleton";

export default function AccountsLoading() {
  return (
    <DashboardLoadingShell>
      <div className="page-grid">
        <section className="grid gap-6 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <MetricCardSkeleton key={index} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <ChartCardSkeleton />
          <div className="panel p-6">
            <Skeleton className="h-3 w-28 rounded-full bg-white/5" />
            <Skeleton className="mt-4 h-8 w-56 rounded-2xl" />
            <div className="mt-6 space-y-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <Skeleton className="h-6 w-32 rounded-2xl" />
                  <Skeleton className="mt-4 h-4 w-full rounded-full bg-white/5" />
                  <Skeleton className="mt-2 h-4 w-2/3 rounded-full bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <TransactionTableSkeleton rows={6} />
      </div>
    </DashboardLoadingShell>
  );
}
