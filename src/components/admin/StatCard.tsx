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
    <div className="bg-[#171718] border border-gray-800 rounded-xl p-3 sm:p-4 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1">{title}</p>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1">
              <span className={`text-xs sm:text-sm font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-xs text-gray-500 hidden sm:inline">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`${iconBgColor} p-2 rounded-lg shrink-0`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  );
}
