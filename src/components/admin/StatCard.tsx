import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
}

export function StatCard({ title, value, icon: Icon, trend, iconBgColor = 'bg-orange-500' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-900/50 p-3 shadow-[0_16px_28px_-24px_rgba(15,23,42,0.9)] transition-all hover:-translate-y-0.5 hover:border-slate-700 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm">{title}</p>
          <h3 className="mb-1 truncate text-xl font-bold text-slate-100 sm:text-2xl">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1">
              <span className={`text-xs font-semibold sm:text-sm ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="hidden text-xs text-slate-500 sm:inline">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`${iconBgColor} shrink-0 rounded-xl p-2 shadow-inner`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  );
}
