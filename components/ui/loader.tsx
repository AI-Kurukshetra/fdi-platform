import { classNames } from "@/lib/utils/format";

interface LoaderProps {
  className?: string;
  label?: string;
}

export default function Loader({ className, label }: LoaderProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={classNames(
          "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
          className
        )}
      />
      {label ? <span>{label}</span> : null}
    </span>
  );
}
