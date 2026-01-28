import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral" | "primary";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: string;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400",
  error: "bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400",
  info: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400",
  neutral: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  primary: "bg-primary/10 text-primary",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-2 py-1",
};

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && (
        <span className="material-symbols-outlined text-xs">{icon}</span>
      )}
      {children}
    </span>
  );
}

// Sentiment Badge - specialized for sentiment display
interface SentimentBadgeProps {
  sentiment: "positive" | "negative" | "neutral";
  className?: string;
}

export function SentimentBadge({ sentiment, className }: SentimentBadgeProps) {
  const config = {
    positive: {
      icon: "trending_up",
      label: "Positive",
      variant: "success" as BadgeVariant,
    },
    negative: {
      icon: "trending_down",
      label: "Negative",
      variant: "error" as BadgeVariant,
    },
    neutral: {
      icon: "drag_handle",
      label: "Neutral",
      variant: "neutral" as BadgeVariant,
    },
  };

  const { icon, label, variant } = config[sentiment];

  return (
    <Badge variant={variant} icon={icon} className={className}>
      {label}
    </Badge>
  );
}

// Severity Badge - for crisis/alert levels
interface SeverityBadgeProps {
  level: "critical" | "warning" | "info" | "update";
  className?: string;
}

export function SeverityBadge({ level, className }: SeverityBadgeProps) {
  const config = {
    critical: { label: "Critical", variant: "error" as BadgeVariant },
    warning: { label: "Warning", variant: "warning" as BadgeVariant },
    info: { label: "Info", variant: "info" as BadgeVariant },
    update: { label: "Update", variant: "info" as BadgeVariant },
  };

  const { label, variant } = config[level];

  return (
    <Badge variant={variant} size="sm" className={cn("uppercase tracking-widest", className)}>
      {label}
    </Badge>
  );
}

// Status Badge - for stability/health status
interface StatusBadgeProps {
  status: "optimal" | "stable" | "caution" | "critical";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    optimal: { label: "Optimal", variant: "success" as BadgeVariant },
    stable: { label: "Stable", variant: "success" as BadgeVariant },
    caution: { label: "Caution", variant: "warning" as BadgeVariant },
    critical: { label: "Critical", variant: "error" as BadgeVariant },
  };

  const { label, variant } = config[status];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
