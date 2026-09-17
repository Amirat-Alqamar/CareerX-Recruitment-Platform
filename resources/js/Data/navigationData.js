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
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  BellRing,
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
      { label: 'Company Profile', path: '/employer/company', isBlade: false, icon: Building2 },
    ],
  },
  {
    group: 'CANDIDATES & RECRUITMENT',
    items: [
      { label: 'Manage Jobs', path: '/employer/jobs', isBlade: false, icon: Briefcase },
      { label: 'Post a New Job', path: '/employer/jobs/create', isBlade: false, icon: PlusCircle },
      { label: 'Job Applicants', path: '/employer/applicants', isBlade: false, icon: Users },
    ],
  },
];

export const adminNavigation = [
  {
    group: 'ADMIN CONTROL',
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', isBlade: false, icon: LayoutDashboard },
      { label: 'Pending Approvals', path: '/admin/pending-jobs', isBlade: false, icon: ShieldCheck },
    ],
  },
  {
    group: 'PLATFORM MANAGEMENT',
    items: [
      { label: 'Manage Users', path: '/admin/users', isBlade: false, icon: Users },
      { label: 'Manage Jobs', path: '/admin/jobs', isBlade: false, icon: Briefcase },
    ],
  },
  {
    group: 'ANALYTICS & REPORTS',
    items: [
      { label: 'Reports & Statistics', path: '/admin/reports', isBlade: false, icon: BarChart3 },
    ],
  },
];


