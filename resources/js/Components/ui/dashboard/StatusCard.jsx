import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function StatusCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
}) {
  const variants = {
    default: {
      iconBg: 'bg-[#014D55]/10 text-[#014D55]',
      accentColor: 'text-[#014D55]',
    },
    purple: {
      iconBg: 'bg-purple-100 text-purple-600',
      accentColor: 'text-purple-600',
    },
    warning: {
      iconBg: 'bg-amber-100 text-amber-600',
      accentColor: 'text-amber-600',
    },
    success: {
      iconBg: 'bg-[#00BBA7]/15 text-[#008A7B]',
      accentColor: 'text-[#008A7B]',
    },
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-36 transition-all duration-300 hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 group">
      {/* Top Bar: Icon & Trend */}
      <div className="flex items-center justify-between">

        <div className="text-3xl font-black text-slate-900 tracking-tight">
        {value}
        </div>

        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${currentVariant.iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex items-center justify-between">

        <div className="text-xs font-semibold text-slate-500">
          {title}
        </div>

        <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100 transition-colors">
          <TrendingUp className="w-3.5 h-3.5" />
        </div>
        
      </div>
    </div>
  );
}
