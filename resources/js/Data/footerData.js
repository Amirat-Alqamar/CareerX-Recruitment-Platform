import { FaXTwitter, FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa6';

export const footerSections = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/#about' },
      { name: 'Careers', href: '/jobs' },
      { name: 'Press', href: '/#about' },
      { name: 'Blog', href: '/#blog' },
      { name: 'Partners', href: '/companies' },
    ],
  },
  {
    title: 'For Job Seekers',
    links: [
      { name: 'Browse Jobs', href: '/jobs' },
      { name: 'Browse Companies', href: '/companies' },
      { name: 'Job Alerts', href: '/jobs' },
      { name: 'Career Resources', href: '/#blog' },
      { name: 'Salary Guide', href: '/jobs' },
    ],
  },
  {
    title: 'For Employers',
    links: [
      { name: 'Post a Job', href: '/employer/jobs/create' },
      { name: 'Talent Search', href: '/companies' },
      { name: 'ATS Features', href: '/#about' },
      { name: 'Pricing', href: '/#about' },
      { name: 'Enterprise', href: '/companies' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/#faq' },
      { name: 'FAQ', href: '/#faq' },
      { name: 'Contact Us', href: '/#about' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  },
];

export const socialLinks = [
  { icon: FaXTwitter, href: '#', label: 'Twitter' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  { icon: FaGithub, href: '#', label: 'GitHub' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
];
