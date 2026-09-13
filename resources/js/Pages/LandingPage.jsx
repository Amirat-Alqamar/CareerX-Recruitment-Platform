import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import HeroSection from '@/Components/Landing/HeroSection';
import FeaturedJobsSection from '@/Components/Landing/FeaturedJobsSection';
import CategoriesSection from '@/Components/Landing/CategoriesSection';
import HowItWorksSection from '@/Components/Landing/HowItWorksSection';
import TestimonialsSection from '@/Components/Landing/TestimonialsSection';
import BlogSection from '@/Components/Landing/BlogSection';
import NewsletterSection from '@/Components/Landing/NewsletterSection';
import FaqSection from '@/Components/Landing/FaqSection';

export default function LandingPage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturedJobsSection/>
      <CategoriesSection/>
      <HowItWorksSection/>
      <TestimonialsSection/>
      <BlogSection/>
      <FaqSection/>
      <NewsletterSection/>
    </MainLayout>
  );
}
