import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AppLayout } from '@/layouts/AppLayout';
import LoginPage from '@/pages/LoginPage';

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
      { index: true, element: <Placeholder title="Dashboard" /> },
      { path: 'transactions', element: <Placeholder title="Transactions" /> },
      { path: 'transactions/:id', element: <Placeholder title="Transaction Details" /> },
      { path: 'uploads', element: <Placeholder title="Uploads" /> },
      { path: 'reports', element: <Placeholder title="Reports" /> },
      { path: 'audit-logs', element: <Placeholder title="Audit Logs" /> },
      { path: 'administration', element: <Placeholder title="Administration" /> },
      { path: 'profile', element: <Placeholder title="Profile" /> },
    ],
  },
]);