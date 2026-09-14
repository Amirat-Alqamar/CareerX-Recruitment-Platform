// resources/js/Components/UI/Dashboard/StatusCard.jsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function StatusCard({
  title,
  value,
  icon: Icon,
  variant = 'default', // default | success | warning | info | purple
  badgeText,
}) {

  const variants = {
    default: {
      bg: 'bg-emerald-50/60 border-emerald-100',
      iconBg: 'bg-[#014D55] text-white',
    },
    purple: {
      bg: 'bg-purple-50/60 border-purple-100',
      iconBg: 'bg-purple-600 text-white',
    },
    warning: {
      bg: 'bg-amber-50/60 border-amber-100',
      iconBg: 'bg-amber-500 text-white',
    },
    success: {
      bg: 'bg-teal-50/60 border-teal-100',
      iconBg: 'bg-[#00BBA7] text-white',
    },
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={`p-6 rounded-2xl border flex flex-col justify-between h-32 transition-all duration-200 hover:shadow-sm ${currentVariant.bg}`}>
      <div className="flex items-center justify-between">
        {Icon && (
          <div className={`w-9 h-9 rounded-xl ${currentVariant.iconBg} flex items-center justify-center shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        <TrendingUp className="w-4 h-4 text-slate-400" />
      </div>

      <div>
        <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
        <div className="text-xs font-semibold text-slate-500 mt-0.5">{title}</div>
      </div>
    </div>
  );
}
