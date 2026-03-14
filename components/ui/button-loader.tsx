"use client";

import { useEffect, useState, type ButtonHTMLAttributes, type MouseEvent } from "react";
import { useFormStatus } from "react-dom";
import Loader from "@/components/ui/loader";
import { classNames } from "@/lib/utils/format";

type ButtonVariant = "ghost" | "primary" | "secondary";

interface ButtonLoaderProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "formAction"> {
  formAction?: string | ((formData: FormData) => void | Promise<void>);
  label: string;
  pendingLabel?: string;
  variant?: ButtonVariant;
}

export function getButtonClasses(variant: ButtonVariant, className?: string) {
  return classNames(
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
    variant === "primary" && "bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white shadow-glow hover:brightness-110",
    variant === "secondary" && "border border-slate-700 bg-slate-900/80 text-slate-100 hover:border-slate-600 hover:bg-slate-800/80",
    variant === "ghost" && "border border-slate-700 bg-slate-950/60 text-slate-200 hover:border-slate-600 hover:bg-slate-900/80",
    className
  );
}

export default function ButtonLoader({
  className,
  disabled,
  formAction,
  label,
  onClick,
  pendingLabel,
  type = "submit",
  variant = "primary",
  ...props
}: ButtonLoaderProps) {
  const { pending } = useFormStatus();
  const [wasClicked, setWasClicked] = useState(false);
  const isDisabled = disabled || pending;
  const showPendingState = pending && wasClicked;

  useEffect(() => {
    if (!pending) {
      setWasClicked(false);
    }
  }, [pending]);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    setWasClicked(true);
    onClick?.(event);
  }

  return (
    <button
      type={type}
      formAction={formAction}
      disabled={isDisabled}
      aria-busy={showPendingState}
      className={getButtonClasses(variant, className)}
      onClick={handleClick}
      {...props}
    >
      {showPendingState ? <Loader /> : null}
      <span>{showPendingState ? pendingLabel ?? label : label}</span>
    </button>
  );
}
