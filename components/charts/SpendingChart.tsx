import dynamic from "next/dynamic";
import { ChartCardSkeleton } from "@/components/ui/loading-state";
import type { ChartDatum } from "@/lib/analytics/spending";

interface SpendingChartProps {
  data: ChartDatum[];
  subtitle: string;
  title: string;
  variant: "category" | "monthly";
}

const SpendingChartClient = dynamic(() => import("@/components/charts/SpendingChartClient"), {
  ssr: false,
  loading: () => <ChartCardSkeleton />
});

export default function SpendingChart(props: SpendingChartProps) {
  return <SpendingChartClient {...props} />;
}
