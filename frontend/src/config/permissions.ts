export type AppRole = 'Administrator' | 'Operations User' | 'Report Viewer';

export type AppRoute =
  | 'dashboard'
  | 'transactions'
  | 'uploads'
  | 'reports'
  | 'auditLogs'
  | 'administration'
  | 'uploadHistory'
  | 'settings';

// Mirrors the consolidated permission matrix in Document 11 §23.
// Backend authorization is the real security boundary — this drives
// sidebar visibility and frontend route guards only.
export const ROUTE_PERMISSIONS: Record<AppRoute, AppRole[]> = {
  dashboard: ['Administrator', 'Operations User', 'Report Viewer'],
  transactions: ['Operations User'],
  uploads: ['Operations User'],
  reports: ['Operations User', 'Report Viewer'],
  auditLogs: ['Administrator'],
  administration: ['Administrator'],
  uploadHistory: ['Administrator'],
  settings: ['Administrator', 'Operations User', 'Report Viewer'],
};

export function canAccessRoute(role: AppRole | undefined, route: AppRoute): boolean {
  if (!role) return false;
  return ROUTE_PERMISSIONS[route].includes(role);
}

// Per Doc 11 §23: Report Viewer can view/download reports but not generate them.
export function canGenerateReports(role: AppRole | undefined): boolean {
  return role === 'Administrator' || role === 'Operations User';
}

export interface NavItemConfig {
  route: AppRoute;
  label: string;
  path: string;
}

// Per Doc 11 §20.5 — each role gets a distinct, purpose-built nav set,
// not the same list with items hidden.
export const NAV_ITEMS: NavItemConfig[] = [
  { route: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { route: 'transactions', label: 'Transactions', path: '/transactions' },
  { route: 'uploads', label: 'Uploads', path: '/uploads' },
  { route: 'reports', label: 'Reports', path: '/reports' },
  { route: 'uploadHistory', label: 'Upload History', path: '/administration/upload-history' },
  { route: 'auditLogs', label: 'Audit Logs', path: '/audit-logs' },
  { route: 'administration', label: 'Administration', path: '/administration' },
  { route: 'settings', label: 'Settings', path: '/settings' },
];

export function getNavItemsForRole(role: AppRole | undefined): NavItemConfig[] {
  if (!role) return [];
  return NAV_ITEMS.filter((item) => ROUTE_PERMISSIONS[item.route].includes(role));
}