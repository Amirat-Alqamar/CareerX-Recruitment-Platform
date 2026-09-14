import React, { useState } from 'react';
import { MapPin, Bookmark } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function JobCard({ job }) {
  const { __ } = useTranslation();
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header: Logo, Title, Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${job.logoBg} text-white font-bold flex items-center justify-center shrink-0 text-sm`}>
              {job.logoText}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-snug hover:text-primary transition-colors cursor-pointer">
                {__(job.title)}
              </h3>
              <p className="text-xs text-gray-500 font-medium">{job.company}</p>
            </div>
          </div>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="text-gray-400 hover:text-primary transition-colors p-1 cursor-pointer"
            title={isSaved ? __('Job Saved') : __('Save Job')}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-primary text-primary' : ''}`} />
          </button>
        </div>

        {/* Location & Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {job.location}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-medium">
            {__(job.type)}
          </span>
          {job.isRemote && (
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
              {__('Remote')}
            </span>
          )}
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {job.skills.map((skill, index) => (
            <span key={index} className="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Salary & Apply Button */}
      <div className="pt-6 mt-4 border-t border-gray-50 flex items-center justify-between gap-2">
        <div>
          <p className="text-base font-bold text-gray-900">{job.salary}</p>
          <p className="text-[11px] text-gray-400 font-medium">
            {__(job.experience)} • {__(job.postedAt)}
          </p>
        </div>
        <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer">
          {__('Apply Now')}
        </button>
      </div>
    </div>
  );
}
