import { UserCheck, Building2 } from 'lucide-react';

export const howItWorksData = [
  {
    id: 'job-seekers',
    type: 'seeker',
    headerIcon: UserCheck,
    title: 'For Job Seekers',
    ctaText: 'Get Started Free',
    ctaHref: '/register?type=seeker',
    cardHeaderBg: 'bg-[#014D55]',
    btnBg: 'bg-[#014D55] hover:bg-[#01383E]',
    steps: [
      {
        number: '01',
        title: 'Create Your Profile',
        description: 'Build a comprehensive profile that showcases your skills, experience, and career goals.',
      },
      {
        number: '02',
        title: 'Build Your Resume',
        description: 'Use our professional resume builder to create a standout CV in minutes.',
      },
      {
        number: '03',
        title: 'Apply to Jobs',
        description: 'One-click apply to thousands of relevant positions matched to your profile.',
      },
      {
        number: '04',
        title: 'Ace the Interview',
        description: 'Prepare with AI-powered interview tips and schedule sessions seamlessly.',
      },
      {
        number: '05',
        title: 'Get Hired',
        description: 'Receive and evaluate offers, then start your exciting new career journey.',
      },
    ],
  },
  {
    id: 'companies',
    type: 'employer',
    headerIcon: Building2,
    title: 'For Companies',
    ctaText: 'Start Hiring',
    ctaHref: '/register?type=employer',
    cardHeaderBg: 'bg-[#00BBA7]',
    btnBg: 'bg-[#00BBA7] hover:bg-[#00A391]',
    steps: [
      {
        number: '01',
        title: 'Create Company Profile',
        description: 'Showcase your company culture, benefits, and why top talent should join your team.',
      },
      {
        number: '02',
        title: 'Publish Job Posts',
        description: 'Create detailed, compelling job descriptions that attract the right candidates.',
      },
      {
        number: '03',
        title: 'Review Applicants',
        description: 'AI-powered screening surfaces the best matches instantly from your talent pool.',
      },
      {
        number: '04',
        title: 'Schedule Interviews',
        description: 'Coordinate interviews effortlessly with automated scheduling and reminders.',
      },
      {
        number: '05',
        title: 'Hire & Onboard',
        description: 'Make data-driven hiring decisions and onboard new team members seamlessly.',
      },
    ],
  },
];
