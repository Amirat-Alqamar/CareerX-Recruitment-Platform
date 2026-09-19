import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import HeroSection from '@/Components/Landing/HeroSection';
import FeaturedJobsSection from '@/Components/Landing/FeaturedJobsSection';
import CategoriesSection from '@/Components/Landing/CategoriesSection';
import HowItWorksSection from '@/Components/Landing/HowItWorksSection';
import TestimonialsSection from '@/Components/Landing/TestimonialsSection';
import BlogSection from '@/Components/Landing/BlogSection';
import FaqSection from '@/Components/Landing/FaqSection';
import NewsletterSection from '@/Components/Landing/NewsletterSection';
import { useTranslation } from '@/hooks/useTranslation';

export default function LandingPage({
  featuredJobs = [],
  totalJobsCount = 0,
  categories = [],
  savedJobIds = [],
  appliedJobIds = [],
  resumes = [],
}) {
  const { __ } = useTranslation();

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  return (
    <MainLayout>
      <Head title={__('Find Jobs')} />
      <HeroSection />
      <FeaturedJobsSection
        jobs={featuredJobs}
        totalJobsCount={totalJobsCount}
        savedJobIds={savedJobIds}
        appliedJobIds={appliedJobIds}
        resumes={resumes}
      />
      <CategoriesSection categories={categories} />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <BlogSection />
      <NewsletterSection />
    </MainLayout>
  );
}
