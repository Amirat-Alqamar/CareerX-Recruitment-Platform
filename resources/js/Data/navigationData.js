import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe,
  Award,
  FolderKanban,
  Search,
  Send,
  Bookmark,
  Settings,
  Users,
  PlusCircle,
  Building2,
} from 'lucide-react';

export const seekerNavigation = [
  {
    group: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/seeker/dashboard', isBlade: false, icon: LayoutDashboard },
      { label: 'My Profile', path: '/seeker/profile', isBlade: false, icon: User },
    ],
  },
  {
    group: 'RESUME & PORTFOLIO',
    items: [
      { label: 'Resume', path: '/job-seeker/resumes', isBlade: true, icon: FileText },
      { label: 'Experience', path: '/job-seeker/experience', isBlade: true, icon: Briefcase },
      { label: 'Education', path: '/job-seeker/education', isBlade: true, icon: GraduationCap },
      { label: 'Skills', path: '/job-seeker/skills', isBlade: true, icon: Wrench },
      { label: 'Languages', path: '/job-seeker/languages', isBlade: true, icon: Globe },
      { label: 'Certificates', path: '/job-seeker/certifications', isBlade: true, icon: Award },
      { label: 'Portfolio', path: '/job-seeker/portfolio', isBlade: true, icon: FolderKanban },
    ],
  },
  {
    group: 'JOB SEARCH',
    items: [
      { label: 'Browse Jobs', path: '/job-seeker/jobs', isBlade: true, icon: Search },
      { label: 'Applications', path: '/job-seeker/applications', isBlade: true, icon: Send },
      { label: 'Saved Jobs', path: '/job-seeker/saved-jobs', isBlade: true, icon: Bookmark },
    ],
  },
  {
    group: 'ACCOUNT',
    items: [
      { label: 'Edit Profile Info', path: '/job-seeker/profile/edit', isBlade: true, icon: Settings },
    ],
  },
];

export const employerNavigation = [
  {
    group: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/employer/dashboard', isBlade: false, icon: LayoutDashboard },
      { label: 'Manage Jobs', path: '/employer/jobs', isBlade: true, icon: Briefcase },
    ],
  },
  {
    group: 'CANDIDATES & RECRUITMENT',
    items: [
      { label: 'Job Applicants', path: '/employer/applicants', isBlade: true, icon: Users },
      { label: 'Post a New Job', path: '/employer/jobs/create', isBlade: true, icon: PlusCircle },
    ],
  },
  {
    group: 'COMPANY PROFILE',
    items: [
      { label: 'Company Profile', path: '/employer/company', isBlade: true, icon: Building2 },
      { label: 'Edit Company Info', path: '/employer/company/edit', isBlade: true, icon: Settings },
    ],
  },
];

