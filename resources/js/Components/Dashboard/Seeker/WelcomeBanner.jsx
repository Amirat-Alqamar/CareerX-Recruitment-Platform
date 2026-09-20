import React from 'react';
import { Circle } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function WelcomeBanner({ userName = '', profileCompletion = 20, stats = {} }) {
  const { __, locale } = useTranslation();
  const displayName = userName || __('Job Seeker');

  const interviewsCount = stats.interviews || 0;
  const underReviewCount = stats.underReview || 0;
  const appliedCount = stats.applied || 0;

  return (
    <div className="space-y-6 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          {__('Welcome, :name!', { name: displayName })}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {appliedCount > 0
            ? __('You have :interviews upcoming interview(s) and :applications application(s) awaiting review.', {
                interviews: interviewsCount,
                applications: underReviewCount,
              })
            : __('Explore open job opportunities and start applying today.')}
        </p>
      </div>

      <div className="bg-[#014D55] rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-3 flex-1 w-full">
          <div className="flex items-center justify-between text-xs font-bold tracking-wider uppercase text-teal-200">
            <span>{__('PROFILE STRENGTH')}</span>
          </div>
          <h3 className="text-lg font-bold">
            {__('Your profile is :percent% complete', { percent: profileCompletion })}
          </h3>

          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden flex items-center">
            <div
              className="bg-[#00BBA7] h-full rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto">
          <ul className="text-xs space-y-1.5 text-slate-200 font-medium">
            <li className="flex items-center gap-2">
              <Circle className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>{__('Add portfolio')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Circle className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>{__('Add 2 more skills')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Circle className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>{__('Upload resume')}</span>
            </li>
          </ul>

          <a
            href={`/${locale}/job-seeker/profile`}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-[#014D55] font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer inline-block text-center"
          >
            {__('Complete Profile')}
          </a>
        </div>
      </div>
    </div>
  );
}

