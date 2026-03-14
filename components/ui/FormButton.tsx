"use client";

import type { ButtonHTMLAttributes } from "react";
import ButtonLoader from "@/components/ui/button-loader";

interface FormButtonProps {
  className?: string;
  formAction?: string | ((formData: FormData) => void | Promise<void>);
  label: string;
  pendingLabel: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  variant?: "ghost" | "primary" | "secondary";
}

export default function FormButton({
  className,
  formAction,
  label,
  pendingLabel,
  type,
  variant = "primary"
}: FormButtonProps) {
  return (
    <ButtonLoader
      className={className}
      formAction={formAction}
      label={label}
      pendingLabel={pendingLabel}
      type={type}
      variant={variant}
    />
  );
}
