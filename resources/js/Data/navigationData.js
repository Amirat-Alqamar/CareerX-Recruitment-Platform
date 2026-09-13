import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  FolderKanban,
  Send,
  Bookmark,
  Sparkles,
  Bell,
  Calendar,
  MessageSquare,
  Settings,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

export const seekerNavigation = [
  {
    group: 'OVERVIEW',
    items: [
      { label: 'Dashboard', routeName: 'seeker.dashboard', icon: LayoutDashboard },
      { label: 'My Profile', routeName: 'seeker.profile', icon: User },
    ],
  },
  {
    group: 'RESUME & PORTFOLIO',
    items: [
      { label: 'Resume', routeName: 'seeker.resume', icon: FileText },
      { label: 'Experience', routeName: 'seeker.experience', icon: Briefcase },
      { label: 'Education', routeName: 'seeker.education', icon: GraduationCap },
      { label: 'Skills', routeName: 'seeker.skills', icon: Wrench },
      { label: 'Certificates', routeName: 'seeker.certificates', icon: Award },
      { label: 'Projects', routeName: 'seeker.projects', icon: FolderKanban },
    ],
  },
  {
    group: 'JOB SEARCH',
    items: [
      { label: 'Applications', routeName: 'seeker.applications', icon: Send, badge: 12 },
      { label: 'Saved Jobs', routeName: 'seeker.saved-jobs', icon: Bookmark, badge: 5 },
      { label: 'Recommended', routeName: 'seeker.recommended', icon: Sparkles },
      { label: 'Job Alerts', routeName: 'seeker.job-alerts', icon: Bell },
    ],
  },
  {
    group: 'ACTIVITY',
    items: [
      { label: 'Interviews', routeName: 'seeker.interviews', icon: Calendar, badge: 2 },
      { label: 'Messages', routeName: 'seeker.messages', icon: MessageSquare, badge: 3 },
      { label: 'Notifications', routeName: 'seeker.notifications', icon: Bell, badge: 8 },
    ],
  },
  {
    group: 'ACCOUNT',
    items: [
      { label: 'Settings', routeName: 'seeker.settings', icon: Settings },
      { label: 'Security', routeName: 'seeker.security', icon: ShieldCheck },
      { label: 'Support', routeName: 'seeker.support', icon: HelpCircle },
    ],
  },
];
