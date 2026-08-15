export type AppRole = 'Administrator' | 'Operations User' | 'Report Viewer';

export type AppRoute =
  | 'dashboard'
  | 'transactions'
  | 'uploads'
  | 'reports'
  | 'auditLogs'
  | 'administration'
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