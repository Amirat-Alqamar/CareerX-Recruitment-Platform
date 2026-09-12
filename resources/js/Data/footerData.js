import { FaXTwitter, FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa6';

export const footerSections = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
      { name: 'Partners', href: '/partners' },
    ],
  },
  {
    title: 'For Job Seekers',
    links: [
      { name: 'Browse Jobs', href: '/jobs' },
      { name: 'Browse Companies', href: '/companies' },
      { name: 'Job Alerts', href: '/alerts' },
      { name: 'Career Resources', href: '/resources' },
      { name: 'Salary Guide', href: '/salary-guide' },
    ],
  },
  {
    title: 'For Employers',
    links: [
      { name: 'Post a Job', href: '/post-job' },
      { name: 'Talent Search', href: '/talent-search' },
      { name: 'ATS Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Enterprise', href: '/enterprise' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact Us', href: '/contact' },
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
