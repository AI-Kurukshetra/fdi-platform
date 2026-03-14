import {
  DashboardLoadingShell,
  FilterPanelSkeleton,
  MetricCardSkeleton,
  TransactionTableSkeleton
} from "@/components/ui/loading-state";
import Skeleton from "@/components/ui/skeleton";

export default function TransactionsLoading() {
  return (
    <DashboardLoadingShell>
      <div className="page-grid">
        <FilterPanelSkeleton />

        <section className="grid gap-6 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <MetricCardSkeleton key={index} />
          ))}
        </section>

        <section>
          <div className="mb-4">
            <Skeleton className="h-3 w-20 rounded-full bg-white/5" />
            <Skeleton className="mt-3 h-8 w-56 rounded-2xl" />
          </div>
          <TransactionTableSkeleton rows={8} />
        </section>
      </div>
    </DashboardLoadingShell>
  );
}
