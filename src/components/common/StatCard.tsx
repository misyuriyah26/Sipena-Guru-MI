import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'blue' | 'slate';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  badge,
  badgeColor = 'emerald',
  onClick,
}) => {
  const badgeClasses = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    blue: 'bg-sky-50 text-sky-800 border-sky-200',
    slate: 'bg-slate-100 text-slate-800 border-slate-200',
  }[badgeColor];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {value}
            </span>
            {badge && (
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${badgeClasses}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
};
