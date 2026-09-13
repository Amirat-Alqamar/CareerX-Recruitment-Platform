import React from 'react';
import { Pencil } from 'lucide-react';

export default function ProfessionalSummary({ summary }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-base">Professional Summary</h3>
        <button type="button" className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed font-medium">
        {summary || 'Senior UX Designer with 7+ years of experience crafting intuitive digital products for B2B and B2C companies. I specialize in design systems, user research, and cross-functional collaboration. Passionate about creating accessible, beautiful experiences that drive business results.'}
      </p>
    </div>
  );
}
