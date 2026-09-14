import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ProfileHeader from '@/Components/Dashboard/Seeker/Profile/ProfileHeader';
import ProfessionalSummary from '@/Components/Dashboard/Seeker/Profile/ProfessionalSummary';
import ExperienceSection from '@/Components/Dashboard/Seeker/Profile/ExperienceSection';
import SkillsSection from '@/Components/Dashboard/Seeker/Profile/SkillsSection';
import LanguagesSection from '@/Components/Dashboard/Seeker/Profile/LanguagesSection';
import useTranslation from '@/hooks/useTranslation';

export default function Profile({ profileData }) {
  const { __ } = useTranslation();

  return (
    <DashboardLayout userRole="seeker">
      <Head title={__('My Profile')} />
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Main Banner & User Overview */}
        <ProfileHeader data={profileData?.header} />

        {/* 2 Columns Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <ProfessionalSummary summary={profileData?.summary} />
            <ExperienceSection experiences={profileData?.experiences} />
          </div>

          {/* Right Column - Side Details (1 Col) */}
          <div className="space-y-6">
            <SkillsSection skills={profileData?.skills} />
            <LanguagesSection languages={profileData?.languages} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

