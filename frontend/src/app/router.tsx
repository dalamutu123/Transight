import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AppLayout } from '@/layouts/AppLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import TransactionsPage from '@/pages/TransactionsPage';
import TransactionDetailsPage from '@/pages/TransactionDetailsPage';
import UploadsPage from '@/pages/UploadsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Simple placeholder so every route resolves to something visible
// until each page gets built out on its scheduled day.
function Placeholder({ title }: { title: string }) {
  return <div className="text-charcoal text-lg font-medium">{title} — coming soon</div>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'transactions/:id', element: <TransactionDetailsPage /> },
      { path: 'uploads', element: <UploadsPage /> },
      { path: 'reports', element: <Placeholder title="Reports" /> },
      { path: 'audit-logs', element: <Placeholder title="Audit Logs" /> },
      { path: 'administration', element: <Placeholder title="Administration" /> },
      { path: 'profile', element: <Placeholder title="Profile" /> },
    ],
  },
]);