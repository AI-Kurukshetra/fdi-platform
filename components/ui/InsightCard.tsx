interface InsightCardProps {
  content: string;
  createdAt: string;
  type: string;
}

export default function InsightCard({ content, createdAt, type }: InsightCardProps) {
  return (
    <article className="group panel relative flex h-full flex-col justify-between overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-blue-500/10 opacity-80" />
      <div>
        <p className="surface-label">{type}</p>
        <p className="mt-4 text-sm leading-7 text-slate-200">{content}</p>
      </div>

      <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
        Updated {new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric" }).format(new Date(createdAt))}
      </p>
    </article>
  );
}
