"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/utils/constants";
import { classNames } from "@/lib/utils/format";

export default function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-6 left-6 z-30 hidden w-72 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 shadow-panel backdrop-blur lg:flex lg:flex-col">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-indigo-mesh opacity-40" />
        <div className="pointer-events-none absolute -right-16 top-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex-1 p-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="surface-label">AI Financial Dashboard</p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight text-slate-100">Modern money movement, at a glance.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Track category shifts, monitor monthly spend, and catch recurring outflows from one polished workspace.
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navigationItems.map((item, index) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link key={item.href} href={item.href} className="block">
                  <motion.div
                    layout
                    initial={false}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className={classNames(
                      "relative overflow-hidden rounded-2xl border px-4 py-4",
                      active
                        ? "border-indigo-400/30 bg-slate-900 text-slate-100 shadow-glow"
                        : "border-transparent bg-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/70 hover:text-slate-100"
                    )}
                  >
                    {active ? (
                      <motion.div
                        layoutId="sidebar-active-item"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/16 via-purple-500/12 to-blue-500/12"
                        transition={{ type: "spring", stiffness: 280, damping: 30 }}
                      />
                    ) : null}

                    <div className="relative z-10 flex items-center gap-3">
                      <div
                        className={classNames(
                          "flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-semibold",
                          active
                            ? "border-indigo-400/30 bg-indigo-500/15 text-indigo-100"
                            : "border-slate-800 bg-slate-950/80 text-slate-400"
                        )}
                      >
                        0{index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-500">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="relative border-t border-slate-800 px-6 py-5">
          <p className="surface-label">Performance</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Server-rendered pages, lazy-loaded charts, and lightweight motion tuned for quick interaction.</p>
        </div>
      </aside>

      <div className="panel-muted sticky top-4 z-20 mb-6 overflow-x-auto p-2 lg:hidden">
        <nav className="flex min-w-max gap-2">
          {navigationItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  "rounded-xl px-4 py-2 text-sm font-semibold",
                  active
                    ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white shadow-glow"
                    : "bg-slate-900/80 text-slate-300 hover:bg-slate-800/80 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
