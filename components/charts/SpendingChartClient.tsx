"use client";

import { memo, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { ChartDatum } from "@/lib/analytics/spending";
import { formatCurrency, formatMonthLabel } from "@/lib/utils/format";

interface SpendingChartProps {
  data: ChartDatum[];
  subtitle: string;
  title: string;
  variant: "category" | "monthly";
}

const barGradientStops = [
  ["#818cf8", "#6366f1", "#4338ca"],
  ["#a78bfa", "#8b5cf6", "#6d28d9"],
  ["#60a5fa", "#3b82f6", "#2563eb"],
  ["#67e8f9", "#06b6d4", "#0f766e"]
] as const;

function formatTooltipValue(value: number | string | ReadonlyArray<number | string> | undefined) {
  if (Array.isArray(value)) {
    return formatCurrency(Number(value[0] ?? 0));
  }

  return formatCurrency(Number(value ?? 0));
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{
    color?: string;
    dataKey?: string;
    payload?: ChartDatum;
    value?: number | string;
  }>;
  variant: "category" | "monthly";
}

const ChartTooltip = memo(function ChartTooltip({ active, label, payload, variant }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const entry = payload[0];
  const datum = entry.payload;

  return (
    <div className="min-w-[180px] rounded-2xl border border-slate-700/80 bg-slate-950/95 px-4 py-3 shadow-2xl shadow-indigo-950/30 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        {variant === "monthly" ? formatMonthLabel(String(label)) : label}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-100">{formatTooltipValue(entry.value)}</p>
      {datum ? (
        <p className="mt-1 text-xs text-slate-400">
          {datum.transactions} tracked {datum.transactions === 1 ? "transaction" : "transactions"}
        </p>
      ) : null}
    </div>
  );
});

function SpendingChartClient({ data, subtitle, title, variant }: SpendingChartProps) {
  const shouldReduceMotion = useReducedMotion();
  const gradientId = useId().replace(/:/g, "");
  const areaGradientId = `${gradientId}-area`;
  const lineGradientId = `${gradientId}-line`;
  const barGradientIds = barGradientStops.map((_, index) => `${gradientId}-bar-${index}`);

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="panel relative min-w-0 overflow-hidden p-6"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-indigo-500/10 via-purple-500/8 to-blue-500/10" />

      <div className="relative mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="surface-label">{variant === "category" ? "Category spending" : "Monthly spending"}</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-100">{title}</h3>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-400">{subtitle}</p>
      </div>

      <div className="relative h-[300px] min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={280} debounce={16}>
          {variant === "category" ? (
            <BarChart data={data} barSize={38} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                {barGradientIds.map((id, index) => (
                  <linearGradient key={id} id={id} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={barGradientStops[index][0]} />
                    <stop offset="58%" stopColor={barGradientStops[index][1]} />
                    <stop offset="100%" stopColor={barGradientStops[index][2]} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="3 6" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} tick={{ fill: "#94a3b8" }} />
              <YAxis tickFormatter={(value) => formatCurrency(Number(value))} tickLine={false} axisLine={false} fontSize={12} tick={{ fill: "#64748b" }} />
              <Tooltip
                cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
                content={<ChartTooltip variant="category" />}
              />
              <Bar
                dataKey="value"
                radius={[14, 14, 6, 6]}
                animationDuration={shouldReduceMotion ? 0 : 460}
                animationBegin={shouldReduceMotion ? 0 : 70}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell key={entry.label} fill={`url(#${barGradientIds[index % barGradientIds.length]})`} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id={lineGradientId} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="52%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <linearGradient id={areaGradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.42} />
                  <stop offset="48%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="3 6" />
              <XAxis
                dataKey="label"
                tickFormatter={(value) => formatMonthLabel(String(value))}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "#94a3b8" }}
              />
              <YAxis tickFormatter={(value) => formatCurrency(Number(value))} tickLine={false} axisLine={false} fontSize={12} tick={{ fill: "#64748b" }} />
              <Tooltip
                cursor={{ stroke: "rgba(129, 140, 248, 0.18)", strokeWidth: 1 }}
                content={<ChartTooltip variant="monthly" />}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={`url(#${lineGradientId})`}
                fill={`url(#${areaGradientId})`}
                strokeWidth={3}
                activeDot={{
                  r: 5,
                  fill: "#c4b5fd",
                  stroke: "#0f172a",
                  strokeWidth: 2
                }}
                animationDuration={shouldReduceMotion ? 0 : 520}
                animationBegin={shouldReduceMotion ? 0 : 90}
                animationEasing="ease-out"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}

function propsAreEqual(previous: SpendingChartProps, next: SpendingChartProps) {
  if (previous.title !== next.title || previous.subtitle !== next.subtitle || previous.variant !== next.variant) {
    return false;
  }

  if (previous.data.length !== next.data.length) {
    return false;
  }

  return previous.data.every((entry, index) => {
    const nextEntry = next.data[index];
    return (
      entry.label === nextEntry.label &&
      entry.value === nextEntry.value &&
      entry.transactions === nextEntry.transactions
    );
  });
}

export default memo(SpendingChartClient, propsAreEqual);
