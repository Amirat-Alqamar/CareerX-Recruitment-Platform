import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import WelcomeBanner from '@/Components/Dashboard/Seeker/WelcomeBanner';
import StatsCards from '@/Components/Dashboard/Seeker/StatsCards';
import useTranslation from '@/hooks/useTranslation';

export default function Dashboard({ stats, profileCompletion }) {
  const { auth } = usePage().props;
  const { __ } = useTranslation();
  const userName = auth?.user?.name || __('Job Seeker');

  return (
    <DashboardLayout userRole="seeker">
      <Head title={__('Dashboard')} />
      <WelcomeBanner userName={userName} profileCompletion={profileCompletion ?? 72} />
      <StatsCards statsData={stats} />
    </DashboardLayout>
  );
}

