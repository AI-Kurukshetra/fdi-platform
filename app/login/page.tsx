import { redirect } from "next/navigation";
import { signInAction, signUpAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

interface LoginPageProps {
  searchParams?: {
    email?: string;
    error?: string;
    message?: string;
    next?: string;
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const next = searchParams?.next ?? "/dashboard";

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="panel overflow-hidden p-8 lg:p-10">
          <div className="rounded-[1.5rem] border border-slate-800 bg-gradient-to-br from-indigo-500/18 via-purple-500/12 to-blue-500/10 p-8">
            <p className="surface-label">Modern fintech dashboard</p>
            <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-tight text-slate-100">
              Understand spending patterns before they become surprises.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Explore transaction history, watch category trends unfold, detect recurring charges, and surface actionable
              insights from a single calm, analytics-first workspace.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Category tracking", "See where money flows across shopping, food, transport, and utilities."],
              ["Monthly analytics", "Monitor spend velocity over time with charts built for quick comparisons."],
              ["Recurring payments", "Spot subscriptions and repeated merchant activity automatically."]
            ].map(([title, detail]) => (
              <article key={title} className="panel-muted p-5">
                <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel p-8 lg:p-10">
          <p className="surface-label">Authentication</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-100">Log in or create your workspace</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">Supabase Auth powers email and password sign-in for secure server-rendered dashboards.</p>

          {searchParams?.error ? (
            <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {searchParams.error}
            </div>
          ) : null}

          {searchParams?.message ? (
            <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {searchParams.message}
            </div>
          ) : null}

          <form className="mt-8 space-y-4">
            <input type="hidden" name="next" value={next} />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-200">Email</span>
              <input
                name="email"
                type="email"
                required
                defaultValue={searchParams?.email ?? ""}
                placeholder="you@example.com"
                className="field"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-200">Password</span>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="field"
              />
            </label>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                formAction={signInAction}
                className="button-primary w-full"
              >
                Sign in
              </button>
              <button
                formAction={signUpAction}
                className="button-secondary w-full"
              >
                Create account
              </button>
            </div>
          </form>

          {process.env.NODE_ENV !== "production" ? (
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm leading-6 text-slate-400">
              Local development mode is enabled. The Create account flow will auto-confirm local users if Supabase email confirmation blocks sign-in.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
