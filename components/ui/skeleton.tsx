import type { HTMLAttributes } from "react";
import { classNames } from "@/lib/utils/format";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export default function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={classNames(
        "relative overflow-hidden rounded-md bg-white/10 animate-pulse before:absolute before:inset-0 before:-translate-x-full before:animate-[skeleton-shimmer_1.8s_ease-in-out_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}
