import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import HeroSection from '@/Components/Landing/HeroSection';
import FeaturedJobsSection from '@/Components/Landing/FeaturedJobsSection';
import CategoriesSection from '@/Components/Landing/CategoriesSection';
import HowItWorksSection from '@/Components/Landing/HowItWorksSection';
import TestimonialsSection from '@/Components/Landing/TestimonialsSection';
import BlogSection from '@/Components/Landing/BlogSection';
import NewsletterSection from '@/Components/Landing/NewsletterSection';
import { useTranslation } from '@/hooks/useTranslation';

export default function LandingPage() {
  const { __ } = useTranslation();

  return (
    <MainLayout>
      <Head title={__('Find Jobs')} />
      <HeroSection />
      <FeaturedJobsSection/>
      <CategoriesSection/>
      <HowItWorksSection/>
      <TestimonialsSection/>
      <BlogSection/>
      <NewsletterSection/>
    </MainLayout>
  );
}
