import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AppLayout } from '@/layouts/AppLayout';
import { PageLoader } from '@/components/PageLoader';
import { RoleGuard } from '@/components/RoleGuard';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage'));
const TransactionDetailsPage = lazy(() => import('@/pages/TransactionDetailsPage'));
const UploadsPage = lazy(() => import('@/pages/UploadsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const AuditLogsPage = lazy(() => import('@/pages/AuditLogsPage'));
const AdministrationPage = lazy(() => import('@/pages/AdministrationPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ChangePasswordPage = lazy(() => import('@/pages/ChangePasswordPage'));
const AccessDeniedPage = lazy(() => import('@/pages/AccessDeniedPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mustChangePassword = useAuthStore((s) => s.user?.mustChangePassword ?? false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }
  return <>{children}</>;
}

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(<LandingPage />),
  },
  {
    path: '/login',
    element: withSuspense(<LandingPage />),
  },
  {
    path: '/change-password',
    element: withSuspense(
      <ProtectedRouteAllowingForcedChange>
        <ChangePasswordPage />
      </ProtectedRouteAllowingForcedChange>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: withSuspense(
          <RoleGuard route="dashboard">
            <DashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: '/transactions',
        element: withSuspense(
          <RoleGuard route="transactions">
            <TransactionsPage />
          </RoleGuard>
        ),
      },
      {
        path: '/transactions/:id',
        element: withSuspense(
          <RoleGuard route="transactions">
            <TransactionDetailsPage />
          </RoleGuard>
        ),
      },
      {
        path: '/uploads',
        element: withSuspense(
          <RoleGuard route="uploads">
            <UploadsPage />
          </RoleGuard>
        ),
      },
      {
        path: '/reports',
        element: withSuspense(
          <RoleGuard route="reports">
            <ReportsPage />
          </RoleGuard>
        ),
      },
      {
        path: '/audit-logs',
        element: withSuspense(
          <RoleGuard route="auditLogs">
            <AuditLogsPage />
          </RoleGuard>
        ),
      },
      {
        path: '/administration',
        element: withSuspense(
          <RoleGuard route="administration">
            <AdministrationPage />
          </RoleGuard>
        ),
      },
      { path: '/profile', element: withSuspense(<ProfilePage />) },
      { path: '/access-denied', element: withSuspense(<AccessDeniedPage />) },
    ],
  },
]);

// Change-password must be reachable while mustChangePassword is true,
// so it can't use the regular ProtectedRoute (which would redirect back here).
function ProtectedRouteAllowingForcedChange({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}