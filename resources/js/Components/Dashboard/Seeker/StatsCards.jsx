import React from 'react';
import StatusCard from '@/Components/ui/dashboard/StatusCard';
import { Send, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function StatsCards({ statsData }) {
  const { __ } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatusCard
        title={__('Applied')}
        value={statsData?.applied ?? 0}
        icon={Send}
        variant="default"
      />
      <StatusCard
        title={__('Under Review')}
        value={statsData?.underReview ?? 0}
        icon={Clock}
        variant="purple"
      />
      <StatusCard
        title={__('Interviews')}
        value={statsData?.interviews ?? 0}
        icon={Calendar}
        variant="warning"
      />
      <StatusCard
        title={__('Offers')}
        value={statsData?.offers ?? 0}
        icon={CheckCircle2}
        variant="success"
      />
    </div>
  );
}
