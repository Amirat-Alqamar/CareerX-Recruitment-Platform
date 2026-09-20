import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import ModalWrapper from './ModalWrapper';
import useTranslation from '@/hooks/useTranslation';
import { Trash2, Plus } from 'lucide-react';

export default function SkillsModal({ isOpen, onClose, skills = [], allSkills = [] }) {
  const { __, locale } = useTranslation();
  const [skillName, setSkillName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const popularSkills = [
    'React',
    'Laravel',
    'JavaScript',
    'PHP',
    'TypeScript',
    'Tailwind CSS',
    'Node.js',
    'UI/UX Design',
    'SQL',
    'Git & GitHub',
    'Docker',
    'Python',
  ];

  const handleAddSkill = (nameToAdd) => {
    const finalName = nameToAdd || skillName;
    if (!finalName.trim()) return;

    setLoading(true);
    setErrors({});

    router.post(
      `/${locale}/job-seeker/skills`,
      { skill_name: finalName.trim() },
      {
        preserveScroll: true,
        onSuccess: () => {
          setLoading(false);
          setSkillName('');
        },
        onError: (err) => {
          setLoading(false);
          setErrors(err);
        },
      }
    );
  };

  const handleDeleteSkill = (skillId) => {
    if (!window.confirm(__('Are you sure you want to remove this skill?'))) return;
    setLoading(true);
    router.delete(`/${locale}/job-seeker/skills/${skillId}`, {
      preserveScroll: true,
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false),
    });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={__('Manage Skills')}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddSkill();
          }}
          className="space-y-2"
        >
          <label className="block text-xs font-bold text-slate-700 uppercase">
            {__('Add New Skill')} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder={__('Type skill name...')}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
            />
            <button
              type="submit"
              disabled={loading || !skillName.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#008A7B] hover:bg-[#014D55] rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{__('Add')}</span>
            </button>
          </div>
          {errors.skill_name && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.skill_name}</p>
          )}
        </form>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {__('Suggested Skills (Click to add):')}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {popularSkills.map((s) => {
              const alreadyHas = skills.some(
                (item) => (item.name || item).toLowerCase() === s.toLowerCase()
              );
              return (
                <button
                  type="button"
                  key={s}
                  disabled={alreadyHas || loading}
                  onClick={() => handleAddSkill(s)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    alreadyHas
                      ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-default'
                      : 'bg-white border-slate-200 hover:border-[#008A7B] hover:bg-[#E6F8F6] text-slate-700 font-medium'
                  }`}
                >
                  {alreadyHas ? '✓ ' : '+ '} {s}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              {__('Your Current Skills')} ({skills.length})
            </label>
          </div>

          {skills && skills.length > 0 ? (
            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1">
              {skills.map((skill, index) => {
                const id = skill.id || skill;
                const name = skill.name || skill;
                return (
                  <div
                    key={id || index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 text-xs font-bold transition-colors"
                  >
                    <span>{name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(id)}
                      disabled={loading}
                      title={__('Remove Skill')}
                      className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-xs font-medium">{__('No skills added yet.')}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            {__('Done')}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
