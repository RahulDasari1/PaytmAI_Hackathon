import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  growthPct?: number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  reverseGrowthColor?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  growthPct,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-blue-50',
  iconColor = 'text-[#0F2D6B]',
  reverseGrowthColor = false
}) => {
  const isPositive = growthPct !== undefined && growthPct > 0;
  const isNegative = growthPct !== undefined && growthPct < 0;

  let growthColor = 'text-slate-600 bg-slate-100';
  if (growthPct !== undefined) {
    if (isPositive) {
      growthColor = reverseGrowthColor ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (isNegative) {
      growthColor = reverseGrowthColor ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-rose-700 bg-rose-50 border-rose-200';
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl ${iconBgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </span>
      </div>

      {growthPct !== undefined && (
        <div className="mt-2.5 flex items-center gap-2">
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${growthColor}`}>
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegative && <TrendingDown className="w-3 h-3" />}
            {growthPct === 0 && <Minus className="w-3 h-3" />}
            <span>{isPositive ? `+${growthPct}%` : `${growthPct}%`}</span>
          </div>
          {subtitle && (
            <span className="text-xs text-slate-400 font-medium truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
