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
    group: 'JOB SEARCH',
    items: [
      { label: 'Browse Jobs', path: '/job-seeker/jobs', isBlade: false, icon: Search },
      { label: 'Applications', path: '/job-seeker/applications', isBlade: false, icon: Send },
      { label: 'Saved Jobs', path: '/job-seeker/saved-jobs', isBlade: false, icon: Bookmark },
    ],
  },
];

export const employerNavigation = [
  {
    group: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/employer/dashboard', isBlade: false, icon: LayoutDashboard },
      { label: 'Manage Jobs', path: '/employer/jobs', isBlade: false, icon: Briefcase },
    ],
  },
  {
    group: 'CANDIDATES & RECRUITMENT',
    items: [
      { label: 'Job Applicants', path: '/employer/applicants', isBlade: false, icon: Users },
      { label: 'Post a New Job', path: '/employer/jobs/create', isBlade: false, icon: PlusCircle },
    ],
  },
  {
    group: 'COMPANY PROFILE',
    items: [
      { label: 'Company Profile', path: '/employer/company', isBlade: false, icon: Building2 },
      { label: 'Edit Company Info', path: '/employer/company/edit', isBlade: false, icon: Settings },
    ],
  },
];

