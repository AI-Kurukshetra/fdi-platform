import {
  ChartCardSkeleton,
  DashboardLoadingShell,
  InsightCardSkeleton,
  MetricCardSkeleton,
  RecurringCardSkeleton,
  TransactionTableSkeleton
} from "@/components/ui/loading-state";
import Skeleton from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <DashboardLoadingShell>
      <div className="page-grid">
        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <article className="panel relative overflow-hidden p-6 lg:p-7">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-indigo-500/14 via-purple-500/12 to-blue-500/10" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="max-w-2xl">
                <Skeleton className="h-3 w-32 rounded-full bg-white/5" />
                <Skeleton className="mt-4 h-12 w-full max-w-2xl rounded-3xl" />
                <Skeleton className="mt-4 h-4 w-full max-w-xl rounded-full bg-white/5" />
                <Skeleton className="mt-2 h-4 w-5/6 max-w-lg rounded-full bg-white/5" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="panel-muted p-4">
                    <Skeleton className="h-3 w-20 rounded-full bg-white/5" />
                    <Skeleton className="mt-3 h-8 w-20 rounded-2xl" />
                  </div>
                ))}
              </div>
            </div>
          </article>

          <div className="grid gap-6">
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <MetricCardSkeleton key={index} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <ChartCardSkeleton />
          <ChartCardSkeleton />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-3 w-28 rounded-full bg-white/5" />
              <Skeleton className="mt-3 h-8 w-56 rounded-2xl" />
            </div>
            <TransactionTableSkeleton rows={6} />
          </div>

          <div className="space-y-4">
            <div>
              <Skeleton className="h-3 w-32 rounded-full bg-white/5" />
              <Skeleton className="mt-3 h-8 w-48 rounded-2xl" />
            </div>
            <div className="grid gap-4">
              {Array.from({ length: 3 }, (_, index) => (
                <RecurringCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <Skeleton className="h-3 w-24 rounded-full bg-white/5" />
            <Skeleton className="mt-3 h-8 w-56 rounded-2xl" />
          </div>

          <div className="grid gap-4 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <InsightCardSkeleton key={index} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLoadingShell>
  );
}
