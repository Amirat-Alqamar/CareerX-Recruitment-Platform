import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialCard({ testimonial }) {
  const { quote, rating, author } = testimonial;

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="space-y-6">
        {/* Quote Icon */}
        <Quote className="w-10 h-10 text-slate-200 fill-slate-100 rotate-180 shrink-0" />

        {/* Quote Text */}
        <p className="text-slate-700 text-base leading-relaxed font-normal">
          "{quote}"
        </p>
      </div>

      <div className="mt-8 space-y-4 pt-4">
        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Author Details */}
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full ${author.avatarBg} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm`}>
            {author.initials}
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {author.name}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {author.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
