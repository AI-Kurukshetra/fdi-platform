import PageTransition from "@/components/ui/PageTransition";
import SidebarNavigation from "@/components/ui/SidebarNavigation";
import Skeleton from "@/components/ui/skeleton";

interface DashboardLoadingShellProps {
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardLoadingShell({ actions, children }: DashboardLoadingShellProps) {
  return (
    <div className="min-h-screen bg-dashboard-glow">
      <SidebarNavigation />

      <main className="mx-auto max-w-[1440px] px-4 py-4 lg:pl-[21.5rem] lg:pr-6 lg:pt-6">
        <PageTransition className="space-y-6">
          <section className="panel overflow-hidden">
            <div className="relative border-b border-slate-800 px-6 py-6 lg:px-8">
              <div className="pointer-events-none absolute inset-0 bg-panel-gradient opacity-90" />
              <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl space-y-4">
                  <Skeleton className="h-3 w-40 rounded-full bg-white/5" />
                  <Skeleton className="h-10 w-52 rounded-2xl" />
                  <Skeleton className="h-4 w-full max-w-2xl rounded-full bg-white/5" />
                  <Skeleton className="h-4 w-3/4 max-w-xl rounded-full bg-white/5" />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {actions ?? (
                    <>
                      <Skeleton className="h-10 w-36 rounded-xl" />
                      <Skeleton className="h-10 w-28 rounded-xl bg-white/5" />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 lg:p-8">{children}</div>
          </section>
        </PageTransition>
      </main>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <article className="panel p-6">
      <Skeleton className="h-3 w-24 rounded-full bg-white/5" />
      <Skeleton className="mt-4 h-10 w-32 rounded-2xl" />
      <Skeleton className="mt-4 h-4 w-full rounded-full bg-white/5" />
      <Skeleton className="mt-2 h-4 w-2/3 rounded-full bg-white/5" />
    </article>
  );
}

export function InsightCardSkeleton() {
  return (
    <article className="panel relative overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-indigo-500/12 via-purple-500/8 to-blue-500/10 opacity-80" />
      <div className="relative">
        <Skeleton className="h-3 w-20 rounded-full bg-white/5" />
        <Skeleton className="mt-4 h-4 w-full rounded-full" />
        <Skeleton className="mt-2 h-4 w-11/12 rounded-full bg-white/5" />
        <Skeleton className="mt-2 h-4 w-3/4 rounded-full bg-white/5" />
      </div>
      <Skeleton className="mt-8 h-3 w-24 rounded-full bg-white/5" />
    </article>
  );
}

export function ChartCardSkeleton() {
  return (
    <section className="panel relative overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-indigo-500/10 via-purple-500/8 to-blue-500/10" />
      <div className="relative space-y-4">
        <Skeleton className="h-3 w-28 rounded-full bg-white/5" />
        <Skeleton className="h-8 w-56 rounded-2xl" />
        <Skeleton className="h-4 w-80 max-w-full rounded-full bg-white/5" />
        <Skeleton className="h-[280px] rounded-2xl border border-white/10 bg-white/5" />
      </div>
    </section>
  );
}

export function TransactionTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="panel overflow-hidden">
      <div className="hidden md:block">
        <div className="grid grid-cols-[1.1fr_0.9fr_1.2fr_0.9fr_0.8fr] gap-4 border-b border-slate-800 bg-slate-900/90 px-6 py-4">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-3 w-20 rounded-full bg-white/5" />
          ))}
        </div>

        <div>
          {Array.from({ length: rows }, (_, index) => (
            <div
              key={index}
              className={`grid grid-cols-[1.1fr_0.9fr_1.2fr_0.9fr_0.8fr] gap-4 border-t border-slate-800 px-6 py-4 ${
                index % 2 === 0 ? "bg-slate-950/30" : "bg-slate-900/55"
              }`}
            >
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-full bg-white/5" />
              <Skeleton className="h-4 w-40 rounded-full bg-white/5" />
              <Skeleton className="h-4 w-24 rounded-full bg-white/5" />
              <Skeleton className="ml-auto h-4 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-4 md:hidden">
        {Array.from({ length: Math.min(rows, 5) }, (_, index) => (
          <article key={index} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-full bg-white/5" />
              </div>
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-4 w-full rounded-full bg-white/5" />
            <Skeleton className="mt-2 h-4 w-3/4 rounded-full bg-white/5" />
            <Skeleton className="mt-4 h-3 w-24 rounded-full bg-white/5" />
          </article>
        ))}
      </div>
    </div>
  );
}

export function RecurringCardSkeleton() {
  return (
    <article className="panel p-5">
      <Skeleton className="h-3 w-20 rounded-full bg-white/5" />
      <Skeleton className="mt-4 h-6 w-36 rounded-2xl" />
      <Skeleton className="mt-4 h-4 w-full rounded-full bg-white/5" />
      <Skeleton className="mt-2 h-4 w-3/4 rounded-full bg-white/5" />
    </article>
  );
}

export function FilterPanelSkeleton() {
  return (
    <section className="panel p-6">
      <div className="flex flex-col gap-5">
        <div>
          <Skeleton className="h-3 w-16 rounded-full bg-white/5" />
          <Skeleton className="mt-4 h-8 w-64 rounded-2xl" />
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-20 rounded-full bg-white/5" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}

          <div className="flex flex-wrap gap-3 xl:col-span-4">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    </section>
  );
}
