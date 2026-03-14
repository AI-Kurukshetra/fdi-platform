interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({ children, className }: PageTransitionProps) {
  return <div className={["page-transition", className].filter(Boolean).join(" ")}>{children}</div>;
}
