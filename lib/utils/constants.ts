export const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Overview"
  },
  {
    href: "/transactions",
    label: "Transactions",
    description: "Ledger"
  },
  {
    href: "/insights",
    label: "Insights",
    description: "Signals"
  }
] as const;

export const protectedRoutes = ["/dashboard", "/transactions", "/insights"];
