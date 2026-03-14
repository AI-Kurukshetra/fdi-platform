import Skeleton from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="panel overflow-hidden p-8 lg:p-10">
          <div className="rounded-[1.5rem] border border-slate-800 bg-gradient-to-br from-indigo-500/12 via-purple-500/10 to-blue-500/8 p-8">
            <Skeleton className="h-3 w-36 rounded-full bg-white/5" />
            <Skeleton className="mt-4 h-12 w-full max-w-xl rounded-3xl" />
            <Skeleton className="mt-4 h-4 w-full max-w-2xl rounded-full bg-white/5" />
            <Skeleton className="mt-2 h-4 w-4/5 max-w-2xl rounded-full bg-white/5" />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <article key={index} className="panel-muted p-5">
                <Skeleton className="h-6 w-28 rounded-2xl" />
                <Skeleton className="mt-4 h-4 w-full rounded-full bg-white/5" />
                <Skeleton className="mt-2 h-4 w-5/6 rounded-full bg-white/5" />
              </article>
            ))}
          </div>
        </section>

        <section className="panel p-8 lg:p-10">
          <Skeleton className="h-3 w-28 rounded-full bg-white/5" />
          <Skeleton className="mt-4 h-10 w-72 rounded-3xl" />
          <Skeleton className="mt-4 h-4 w-full rounded-full bg-white/5" />

          <div className="mt-8 space-y-4">
            {Array.from({ length: 2 }, (_, index) => (
              <div key={index}>
                <Skeleton className="mb-2 h-3 w-16 rounded-full bg-white/5" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl bg-white/5" />
          </div>
        </section>
      </div>
    </main>
  );
}
