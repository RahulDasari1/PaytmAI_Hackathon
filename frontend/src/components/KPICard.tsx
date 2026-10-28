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
  deltaAmount?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  growthPct,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-[#F0F9FF]',
  iconColor = 'text-[#002970]',
  reverseGrowthColor = false,
  deltaAmount
}) => {
  const isPositive = growthPct !== undefined && growthPct > 0;
  const isNegative = growthPct !== undefined && growthPct < 0;

  let pillClasses = 'bg-slate-50 text-slate-600 border-slate-200';
  if (growthPct !== undefined) {
    if (isPositive) {
      pillClasses = reverseGrowthColor 
        ? 'bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]' 
        : 'bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]';
    } else if (isNegative) {
      pillClasses = reverseGrowthColor 
        ? 'bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]' 
        : 'bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]';
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E4EAF1] shadow-fintech-xs hover:shadow-fintech-md transition-all duration-200 flex flex-col justify-between">
      
      {/* Top Header: Label & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0 border border-slate-100`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mt-3">
        <span className="text-2xl sm:text-[26px] font-extrabold text-[#10243A] tracking-tight tabular-nums leading-none">
          {value}
        </span>
      </div>

      {/* Bottom Growth Pill & Comparison Context */}
      <div className="mt-3.5 pt-3 border-t border-[#F2F4F7] flex items-center justify-between text-xs">
        {growthPct !== undefined ? (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${pillClasses} tabular-nums`}>
              {isPositive && <TrendingUp className="w-3 h-3" />}
              {isNegative && <TrendingDown className="w-3 h-3" />}
              {growthPct === 0 && <Minus className="w-3 h-3" />}
              <span>{isPositive ? `+${growthPct}%` : `${growthPct}%`}</span>
            </span>

            {deltaAmount && (
              <span className="text-[11px] font-semibold text-[#344054] tabular-nums">
                ({deltaAmount})
              </span>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-[#667085] font-medium">
            30-day cohort benchmark
          </span>
        )}

        {subtitle && (
          <span className="text-[11px] text-[#667085] truncate font-medium">
            {subtitle}
          </span>
        )}
      </div>

    </div>
  );
};
