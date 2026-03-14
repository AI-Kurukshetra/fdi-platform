import SidebarNavigation from "@/components/ui/SidebarNavigation";
import LogoutButton from "@/components/ui/LogoutButton";
import PageTransition from "@/components/ui/PageTransition";

interface DashboardShellProps {
  actions?: React.ReactNode;
  children: React.ReactNode;
  description: string;
  title: string;
  userEmail: string;
}

export default function DashboardShell({
  actions,
  children,
  description,
  title,
  userEmail
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-dashboard-glow">
      <SidebarNavigation />

      <main className="mx-auto max-w-[1440px] px-4 py-4 lg:pl-[21.5rem] lg:pr-6 lg:pt-6">
        <PageTransition className="space-y-6">
          <section className="panel overflow-hidden">
            <div className="relative border-b border-slate-800 px-6 py-6 lg:px-8">
              <div className="pointer-events-none absolute inset-0 bg-panel-gradient opacity-90" />
              <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <p className="surface-label">Signed in as {userEmail}</p>
                  <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <h2 className="text-3xl font-semibold text-slate-100 lg:text-4xl">{title}</h2>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">{description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {actions}
                  <LogoutButton />
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
