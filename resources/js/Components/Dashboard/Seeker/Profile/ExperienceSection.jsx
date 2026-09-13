import React from 'react';
import { Plus, Pencil } from 'lucide-react';

export default function ExperienceSection() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-base">Experience</h3>
        <button type="button" className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4 items-start">
          {/* Company Logo Badge */}
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
            AB
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-sm">Senior UX Designer</h4>
              <button type="button" className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs font-bold text-slate-500">Airbnb · Full-time</p>
            <p className="text-xs font-semibold text-slate-400">Mar 2022 – Present · 2 yrs 4 mos</p>
            <p className="text-xs font-medium text-slate-600 mt-2 leading-normal">
              Led redesign of the host onboarding experience, reducing time-to-first-listing by 40%. Owned the Design System for the Homes product area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
