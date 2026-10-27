import React from 'react';

export default function StatCard({
  title,
  value,
  unit = '',
  icon: Icon,
  trend,
  trendType = 'neutral',
  subtitle
}) {
  return (
    <div className="bento-card p-5 group flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="my-3 flex items-baseline gap-2">
        <span className="text-3xl font-mono font-bold tracking-tight text-white">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-slate-400 font-medium">{unit}</span>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
          {trend && (
            <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold ${
              trendType === 'positive' ? 'text-emerald-400' :
              trendType === 'negative' ? 'text-rose-400' : 'text-slate-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                trendType === 'positive' ? 'bg-emerald-400' :
                trendType === 'negative' ? 'bg-rose-400' : 'bg-slate-500'
              }`} />
              {trend}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-500 font-mono text-[10px] truncate max-w-[140px]">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
