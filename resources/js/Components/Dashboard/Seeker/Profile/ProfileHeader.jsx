import React, { useState } from 'react';
import { Camera, Download, Pencil, CheckCircle2, MapPin, Mail, Globe, Code2,  } from 'lucide-react';

export default function ProfileHeader({ data }) {
  const [activeTab, setActiveTab] = useState('Profile');

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
      {/* Cover Banner */}
      <div className="h-44 bg-[#008A7B] relative">
        <button type="button" className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all">
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* User Basic Info Container */}
      <div className="px-8 pb-6 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 mb-6">
          {/* Avatar with Camera Overlay */}
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-2xl bg-[#014D55] text-white font-black text-2xl flex items-center justify-center border-4 border-white shadow-md">
              SJ
            </div>
            <button type="button" className="absolute -bottom-1 -right-1 p-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-slate-900 shadow-sm">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button type="button" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Download CV</span>
            </button>
            <button type="button" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#014D55] text-white font-bold text-sm hover:bg-[#01383E] transition-colors">
              <Pencil className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Name & Subtitle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">Sarah Johnson</h1>
                <CheckCircle2 className="w-5 h-5 text-[#008A7B]" />
              </div>
              <p className="text-sm font-semibold text-slate-500 mt-1">Senior UX Designer</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a href="#" className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-[#014D55] hover:border-slate-300 transition-colors">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-[#014D55] hover:border-slate-300 transition-colors">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-[#014D55] hover:border-slate-300 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact Badges */}
          <div className="flex items-center gap-5 flex-wrap text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>sarah@example.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>sarahjohnson.design</span>
            </div>
          </div>

          {/* Job Preference Badges */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#008A7B] text-xs font-extrabold">Open to Work</span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#008A7B] text-xs font-extrabold">Remote Friendly</span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#008A7B] text-xs font-extrabold">$120k+ Salary</span>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="border-t border-slate-100 px-8 flex gap-8">
        {['Profile', 'Resume', 'Portfolio'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`py-3.5 text-sm font-extrabold relative transition-colors ${
              activeTab === tab ? 'text-[#008A7B]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#008A7B] rounded-t-md" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
