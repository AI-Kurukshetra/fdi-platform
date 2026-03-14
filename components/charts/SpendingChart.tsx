import dynamic from "next/dynamic";
import type { ChartDatum } from "@/lib/analytics/spending";

interface SpendingChartProps {
  data: ChartDatum[];
  subtitle: string;
  title: string;
  variant: "category" | "monthly";
}

const SpendingChartClient = dynamic(() => import("@/components/charts/SpendingChartClient"), {
  ssr: false,
  loading: () => (
    <section className="panel relative overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-indigo-500/10 via-purple-500/8 to-blue-500/10" />
      <div className="space-y-4">
        <div className="h-4 w-28 rounded-full bg-slate-800" />
        <div className="h-8 w-56 rounded-full bg-slate-900" />
        <div className="h-[280px] rounded-2xl border border-slate-800 bg-slate-900/70" />
      </div>
    </section>
  )
});

export default function SpendingChart(props: SpendingChartProps) {
  return <SpendingChartClient {...props} />;
}
