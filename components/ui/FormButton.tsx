"use client";

import { useFormStatus } from "react-dom";
import { classNames } from "@/lib/utils/format";

interface FormButtonProps {
  className?: string;
  label: string;
  pendingLabel: string;
  variant?: "ghost" | "primary" | "secondary";
}

export default function FormButton({
  className,
  label,
  pendingLabel,
  variant = "primary"
}: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={classNames(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white shadow-glow hover:brightness-110",
        variant === "secondary" && "border border-slate-700 bg-slate-900/80 text-slate-100 hover:border-slate-600 hover:bg-slate-800/80",
        variant === "ghost" && "border border-slate-700 bg-slate-950/60 text-slate-200 hover:border-slate-600 hover:bg-slate-900/80",
        className
      )}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
