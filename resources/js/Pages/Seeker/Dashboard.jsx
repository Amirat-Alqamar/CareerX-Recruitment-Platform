import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import WelcomeBanner from '@/Components/Dashboard/Seeker/WelcomeBanner';
import StatsCards from '@/Components/ui/dashboard/StatsCards';

export default function Dashboard() {
  return (
    <DashboardLayout userRole="seeker">
      <WelcomeBanner userName="Sarah" />
      <StatsCards />
    </DashboardLayout>
  );
}
