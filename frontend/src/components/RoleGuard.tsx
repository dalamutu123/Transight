import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { canAccessRoute, type AppRoute } from '@/config/permissions';

interface Props {
  route: AppRoute;
  children: React.ReactNode;
}

/**
 * Wraps a page element and verifies the authenticated user's role is
 * permitted for the given route. This is a UX guard only — the backend
 * (authorize middleware) is the real security boundary.
 */
export function RoleGuard({ route, children }: Props) {
  const role = useAuthStore((s) => s.user?.role);

  if (!canAccessRoute(role, route)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}