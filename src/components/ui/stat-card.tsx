import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  trend = "up",
  hint,
  icon,
  accent,
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  hint?: string;
  icon?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/80",
      accent && "ring-1 ring-primary/20"
    )}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
        {icon && <span className="text-muted-foreground/70">{icon}</span>}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-[26px] font-semibold tracking-tight tabular-nums">{value}</span>
        {delta && (
          <span className={cn(
            "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10.5px] font-medium",
            trend === "up" && "bg-[oklch(0.7_0.16_158/0.12)] text-[var(--color-success)]",
            trend === "down" && "bg-[oklch(0.62_0.22_25/0.12)] text-[var(--color-destructive)]",
            trend === "flat" && "bg-muted text-muted-foreground"
          )}>
            {trend === "up" && <ArrowUpRight className="h-3 w-3" />}
            {trend === "down" && <ArrowDownRight className="h-3 w-3" />}
            {delta}
          </span>
        )}
      </div>
      {hint && <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}
