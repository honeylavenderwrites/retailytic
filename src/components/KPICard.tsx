import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  className?: string;
}

export default function KPICard({ label, value, change, trend, className }: KPICardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-5 transition-shadow hover:shadow-md", className)}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
      <div className="mt-2 flex items-center gap-1.5">
        {trend === 'up' ? (
          <TrendingUp className="h-3.5 w-3.5 text-success" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-destructive" />
        )}
        <span className={cn("text-xs font-medium", trend === 'up' ? 'text-success' : 'text-destructive')}>
          {change > 0 ? '+' : ''}{change}%
        </span>
        <span className="text-xs text-muted-foreground">vs last period</span>
      </div>
    </div>
  );
}
