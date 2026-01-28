import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  className,
  hover = false,
  padding = "md",
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm",
        hover && "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all cursor-pointer",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  icon?: string;
  iconColor?: string;
  action?: ReactNode;
  badge?: ReactNode;
}

export function CardHeader({
  title,
  icon,
  iconColor = "text-primary",
  action,
  badge,
}: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-border-dark mb-4">
      <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
        {icon && (
          <span className={cn("material-symbols-outlined", iconColor)}>
            {icon}
          </span>
        )}
        {title}
        {badge}
      </h3>
      {action}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  icon?: string;
  footer?: ReactNode;
}

export function StatCard({ label, value, change, icon, footer }: StatCardProps) {
  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        {change && (
          <span
            className={cn(
              "text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1",
              change.positive
                ? "text-emerald-500 bg-emerald-500/10"
                : "text-red-500 bg-red-500/10"
            )}
          >
            <span className="material-symbols-outlined text-xs">
              {change.positive ? "trending_up" : "trending_down"}
            </span>
            {change.value}
          </span>
        )}
        {icon && !change && (
          <span className="material-symbols-outlined text-primary">{icon}</span>
        )}
      </div>
      <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
      {footer && <div className="mt-4">{footer}</div>}
    </Card>
  );
}
