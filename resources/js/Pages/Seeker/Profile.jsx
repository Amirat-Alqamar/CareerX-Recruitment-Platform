import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ProfileHeader from '@/Components/Dashboard/Seeker/Profile/ProfileHeader';
import ProfessionalSummary from '@/Components/Dashboard/Seeker/Profile/ProfessionalSummary';
import ExperienceSection from '@/Components/Dashboard/Seeker/Profile/ExperienceSection';
import EducationSection from '@/Components/Dashboard/Seeker/Profile/EducationSection';
import SkillsSection from '@/Components/Dashboard/Seeker/Profile/SkillsSection';
import LanguagesSection from '@/Components/Dashboard/Seeker/Profile/LanguagesSection';
import CertificationsSection from '@/Components/Dashboard/Seeker/Profile/CertificationsSection';
import ResumesSection from '@/Components/Dashboard/Seeker/Profile/ResumesSection';
import PortfolioSection from '@/Components/Dashboard/Seeker/Profile/PortfolioSection';

import LanguageModal from '@/Components/Dashboard/Seeker/Profile/Modals/LanguageModal';
import EducationModal from '@/Components/Dashboard/Seeker/Profile/Modals/EducationModal';
import ExperienceModal from '@/Components/Dashboard/Seeker/Profile/Modals/ExperienceModal';
import SkillsModal from '@/Components/Dashboard/Seeker/Profile/Modals/SkillsModal';
import CertificationModal from '@/Components/Dashboard/Seeker/Profile/Modals/CertificationModal';
import ResumeModal from '@/Components/Dashboard/Seeker/Profile/Modals/ResumeModal';
import EditProfileModal from '@/Components/Dashboard/Seeker/Profile/Modals/EditProfileModal';
import PortfolioModal from '@/Components/Dashboard/Seeker/Profile/Modals/PortfolioModal';

import useTranslation from '@/hooks/useTranslation';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Profile({
  profileData,
  allLanguages = [],
  allSkills = [],
  countries = [],
  cities = [],
}) {
  const { __ } = useTranslation();
  const { flash } = usePage().props;

  // Active modal state: 'language', 'education', 'experience', 'skills', 'certification', 'resumes', 'profile'
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Flash notification banner state
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (flash?.success || flash?.error) {
      setShowFlash(true);
      const timer = setTimeout(() => setShowFlash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  // Check URL search parameters to trigger specific modal if linked from sidebar
  useEffect(() => {
    // Reset body overflow to guarantee scrolling is never stuck
    document.body.style.overflow = '';

    const urlParams = new URLSearchParams(window.location.search);
    const modalParam = urlParams.get('modal') || urlParams.get('section');
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      if (['portfolio', 'projects'].includes(tabParam.toLowerCase())) setActiveTab('Portfolio');
      else if (['resume', 'resumes', 'cv'].includes(tabParam.toLowerCase())) setActiveTab('Resume');
      else if (['profile', 'overview'].includes(tabParam.toLowerCase())) setActiveTab('Profile');
    }

    if (modalParam) {
      if (['language', 'languages'].includes(modalParam)) setActiveModal('language');
      else if (['education', 'educations'].includes(modalParam)) setActiveModal('education');
      else if (['experience', 'experiences'].includes(modalParam)) setActiveModal('experience');
      else if (['skill', 'skills'].includes(modalParam)) setActiveModal('skills');
      else if (['certificate', 'certificates', 'certification', 'certifications'].includes(modalParam)) setActiveModal('certification');
      else if (['resume', 'resumes', 'cv'].includes(modalParam)) setActiveModal('resumes');
      else if (['portfolio', 'projects'].includes(modalParam)) setActiveModal('portfolio');
      else if (['profile', 'edit'].includes(modalParam)) setActiveModal('profile');

      // Crucial: remove the query parameter immediately so refreshing (F5) doesn't keep reopening the modal!
      window.history.replaceState({}, '', window.location.pathname);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Active tab state: 'Profile', 'Resume', 'Portfolio'
  const [activeTab, setActiveTab] = useState('Profile');

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setTimeout(() => {
      const el = document.getElementById('profile-content-area');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const closeModal = () => {
    document.body.style.overflow = '';
    setActiveModal(null);
    setSelectedItem(null);
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  return (
    <DashboardLayout userRole="seeker">
      <Head title={__('My Profile')} />

      {/* Floating Flash Message Toast */}
      {showFlash && (flash?.success || flash?.error) && (
        <div className="fixed top-20 right-6 rtl:right-auto rtl:left-6 z-50 max-w-md animate-fade-in shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          <div
            className={`p-4 flex items-center justify-between gap-3 text-sm font-bold text-white ${
              flash.success ? 'bg-[#008A7B]' : 'bg-red-600'
            }`}
          >
            <div className="flex items-center gap-2" dir="auto">
              {flash.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span dir="auto" className="leading-snug">
                {__(flash.success || flash.error)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowFlash(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Main Banner & User Overview */}
        <ProfileHeader
          data={profileData?.header}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onEditProfile={() => {
            setSelectedItem(null);
            setActiveModal('profile');
          }}
          onManageResumes={() => {
            setSelectedItem(null);
            setActiveModal('resumes');
          }}
          onOpenPortfolio={() => {
            setSelectedItem(null);
            setActiveModal('portfolio');
          }}
        />

        {/* Tab-driven Content Area */}
        <div id="profile-content-area" className="transition-all duration-300">
          {activeTab === 'Portfolio' && (
            <div className="space-y-6">
              <PortfolioSection
                portfolio={profileData?.portfolio}
                onAdd={() => {
                  setSelectedItem(null);
                  setActiveModal('portfolio');
                }}
                onEdit={(item) => {
                  setSelectedItem(item);
                  setActiveModal('portfolio');
                }}
              />
            </div>
          )}

          {activeTab === 'Resume' && (
            <div className="space-y-6">
              <ResumesSection
                resumes={profileData?.resumes}
                onManage={() => {
                  setSelectedItem(null);
                  setActiveModal('resumes');
                }}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExperienceSection
                  experiences={profileData?.experiences}
                  onAdd={() => {
                    setSelectedItem(null);
                    setActiveModal('experience');
                  }}
                  onEdit={(exp) => {
                    setSelectedItem(exp);
                    setActiveModal('experience');
                  }}
                />
                <EducationSection
                  educations={profileData?.educations}
                  onAdd={() => {
                    setSelectedItem(null);
                    setActiveModal('education');
                  }}
                  onEdit={(edu) => {
                    setSelectedItem(edu);
                    setActiveModal('education');
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'Profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Details (2 Cols) */}
              <div className="lg:col-span-2 space-y-6">
                <ProfessionalSummary
                  summary={profileData?.summary}
                  onEdit={() => {
                    setSelectedItem(null);
                    setActiveModal('profile');
                  }}
                />

                <ExperienceSection
                  experiences={profileData?.experiences}
                  onAdd={() => {
                    setSelectedItem(null);
                    setActiveModal('experience');
                  }}
                  onEdit={(exp) => {
                    setSelectedItem(exp);
                    setActiveModal('experience');
                  }}
                />

                <EducationSection
                  educations={profileData?.educations}
                  onAdd={() => {
                    setSelectedItem(null);
                    setActiveModal('education');
                  }}
                  onEdit={(edu) => {
                    setSelectedItem(edu);
                    setActiveModal('education');
                  }}
                />

                <PortfolioSection
                  portfolio={profileData?.portfolio}
                  onAdd={() => {
                    setSelectedItem(null);
                    setActiveModal('portfolio');
                  }}
                  onEdit={(item) => {
                    setSelectedItem(item);
                    setActiveModal('portfolio');
                  }}
                />
              </div>

              {/* Right Column - Side Details (1 Col) */}
              <div className="space-y-6">
                <ResumesSection
                  resumes={profileData?.resumes}
                  onManage={() => {
                    setSelectedItem(null);
                    setActiveModal('resumes');
                  }}
                />

                <SkillsSection
                  skills={profileData?.skills}
                  onManage={() => {
                    setSelectedItem(null);
                    setActiveModal('skills');
                  }}
                />

                <LanguagesSection
                  languages={profileData?.languages}
                  onAdd={() => {
                    setSelectedItem(null);
                    setActiveModal('language');
                  }}
                  onEdit={(lang) => {
                    setSelectedItem(lang);
                    setActiveModal('language');
                  }}
                />

                <CertificationsSection
                  certifications={profileData?.certifications}
                  onAdd={() => {
                    setSelectedItem(null);
                    setActiveModal('certification');
                  }}
                  onEdit={(cert) => {
                    setSelectedItem(cert);
                    setActiveModal('certification');
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Modals */}
      <LanguageModal
        isOpen={activeModal === 'language'}
        onClose={closeModal}
        language={selectedItem}
        allLanguages={allLanguages}
      />

      <EducationModal
        isOpen={activeModal === 'education'}
        onClose={closeModal}
        education={selectedItem}
      />

      <ExperienceModal
        isOpen={activeModal === 'experience'}
        onClose={closeModal}
        experience={selectedItem}
      />

      <SkillsModal
        isOpen={activeModal === 'skills'}
        onClose={closeModal}
        skills={profileData?.skills || []}
        allSkills={allSkills}
      />

      <CertificationModal
        isOpen={activeModal === 'certification'}
        onClose={closeModal}
        certification={selectedItem}
      />

      <ResumeModal
        isOpen={activeModal === 'resumes'}
        onClose={closeModal}
        resumes={profileData?.resumes || []}
      />

      <PortfolioModal
        isOpen={activeModal === 'portfolio'}
        onClose={closeModal}
        item={selectedItem}
      />

      <EditProfileModal
        isOpen={activeModal === 'profile'}
        onClose={closeModal}
        details={profileData?.details}
        header={profileData?.header}
        countries={countries}
        cities={cities}
      />
    </DashboardLayout>
  );
}
