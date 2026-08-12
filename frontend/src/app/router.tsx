import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AppLayout } from '@/layouts/AppLayout';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import TransactionsPage from '@/pages/TransactionsPage';
import TransactionDetailsPage from '@/pages/TransactionDetailsPage';
import UploadsPage from '@/pages/UploadsPage';
import ReportsPage from '@/pages/ReportsPage';
import AuditLogsPage from '@/pages/AuditLogsPage';
import AdministrationPage from '@/pages/AdministrationPage';
import ProfilePage from '@/pages/ProfilePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/transactions', element: <TransactionsPage /> },
      { path: '/transactions/:id', element: <TransactionDetailsPage /> },
      { path: '/uploads', element: <UploadsPage /> },
      { path: '/reports', element: <ReportsPage /> },
      { path: '/audit-logs', element: <AuditLogsPage /> },
      { path: '/administration', element: <AdministrationPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
]);