interface StatCardProps {
  detail: string;
  eyebrow: string;
  value: string;
}

export default function StatCard({ detail, eyebrow, value }: StatCardProps) {
  return (
    <article className="group panel relative overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-70" />
      <div className="pointer-events-none absolute -right-10 top-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-3xl transition duration-300 group-hover:scale-125" />
      <p className="surface-label">{eyebrow}</p>
      <p className="metric-value mt-4">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{detail}</p>
    </article>
  );
}
