import {
  DashboardLoadingShell,
  InsightCardSkeleton,
  MetricCardSkeleton,
  RecurringCardSkeleton
} from "@/components/ui/loading-state";
import Skeleton from "@/components/ui/skeleton";

export default function InsightsLoading() {
  return (
    <DashboardLoadingShell
      actions={<Skeleton className="h-10 w-36 rounded-xl bg-white/5" />}
    >
      <div className="page-grid">
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="panel relative overflow-hidden p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-indigo-500/12 via-purple-500/10 to-blue-500/10" />
            <div className="relative">
              <Skeleton className="h-3 w-32 rounded-full bg-white/5" />
              <Skeleton className="mt-4 h-10 w-80 rounded-3xl" />
              <Skeleton className="mt-4 h-4 w-full max-w-2xl rounded-full bg-white/5" />
              <Skeleton className="mt-2 h-4 w-4/5 max-w-xl rounded-full bg-white/5" />
            </div>
          </article>

          <MetricCardSkeleton />
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <MetricCardSkeleton key={index} />
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <InsightCardSkeleton key={index} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-3 w-28 rounded-full bg-white/5" />
              <Skeleton className="mt-3 h-8 w-44 rounded-2xl" />
            </div>

            <div className="grid gap-4">
              {Array.from({ length: 4 }, (_, index) => (
                <RecurringCardSkeleton key={index} />
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <Skeleton className="h-3 w-28 rounded-full bg-white/5" />
            <Skeleton className="mt-3 h-8 w-56 rounded-2xl" />

            <div className="mt-6 space-y-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <Skeleton className="h-3 w-10 rounded-full bg-white/5" />
                      <Skeleton className="mt-3 h-6 w-28 rounded-2xl" />
                    </div>
                    <Skeleton className="h-6 w-24 rounded-2xl" />
                  </div>
                  <Skeleton className="mt-4 h-4 w-full rounded-full bg-white/5" />
                  <Skeleton className="mt-2 h-4 w-3/4 rounded-full bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardLoadingShell>
  );
}
