import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AppLayout } from '@/layouts/AppLayout';
import { PageLoader } from '@/components/PageLoader';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage'));
const TransactionDetailsPage = lazy(() => import('@/pages/TransactionDetailsPage'));
const UploadsPage = lazy(() => import('@/pages/UploadsPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const AuditLogsPage = lazy(() => import('@/pages/AuditLogsPage'));
const AdministrationPage = lazy(() => import('@/pages/AdministrationPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: withSuspense(<DashboardPage />) },
      { path: '/transactions', element: withSuspense(<TransactionsPage />) },
      { path: '/transactions/:id', element: withSuspense(<TransactionDetailsPage />) },
      { path: '/uploads', element: withSuspense(<UploadsPage />) },
      { path: '/reports', element: withSuspense(<ReportsPage />) },
      { path: '/audit-logs', element: withSuspense(<AuditLogsPage />) },
      { path: '/administration', element: withSuspense(<AdministrationPage />) },
      { path: '/profile', element: withSuspense(<ProfilePage />) },
    ],
  },
]);