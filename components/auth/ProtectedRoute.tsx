'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authContext';
import { AuthGuard } from './AuthGuard';
import { AccessDenied, AdminAccessDenied } from './AccessDenied';
import { CreateCampaignAccessDenied } from './CreateCampaignAccessDenied';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireRoles?: string[];
  requirePermissions?: Array<{ resource: string; action: string }>;
  redirectTo?: string;
  showFallback?: boolean;
  showAccessDenied?: boolean;
  isCreateCampaignPage?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireRoles = [],
  requirePermissions = [],
  redirectTo = '/login',
  showFallback = true,
  showAccessDenied = false,
  isCreateCampaignPage = false
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, hasRole, hasPermission } = useAuth();

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    // Redirect if auth is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
      return;
    }

    // Check role requirements and redirect if not met
    if (requireRoles.length > 0 && user) {
      const hasRequiredRole = requireRoles.some(role => hasRole(role));
      console.log('Role check:', {
        userRole: user.role?.name,
        requiredRoles: requireRoles,
        hasRequiredRole
      });
      
      if (!hasRequiredRole) {
        console.log('Insufficient role - user does not have required role');
        if (showAccessDenied) {
          return; // Will show AccessDenied component below
        } else {
          console.log('Redirecting to home - insufficient role');
          router.push('/'); // Redirect to home if insufficient role
          return;
        }
      }
    }

    // Check permission requirements and redirect if not met
    if (requirePermissions.length > 0 && user) {
      const hasRequiredPermissions = requirePermissions.every(
        ({ resource, action }) => hasPermission(resource, action)
      );
      if (!hasRequiredPermissions) {
        if (showAccessDenied) {
          return; // Will show AccessDenied component below
        } else {
          router.push('/'); // Redirect to home if insufficient permissions
          return;
        }
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    requireAuth,
    requireRoles,
    requirePermissions,
    redirectTo,
    router,
    hasRole,
    hasPermission
  ]);

  // If we want to show fallback UI instead of redirecting
  if (showFallback) {
    return (
      <AuthGuard
        requireAuth={requireAuth}
        requireRoles={requireRoles}
        requirePermissions={requirePermissions}
        redirectTo={redirectTo}
      >
        {children}
      </AuthGuard>
    );
  }

  // If loading or checks haven't passed yet, don't render anything
  // (component will redirect via useEffect)
  if (isLoading) {
    return null;
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireRoles.length > 0 && user) {
    const hasRequiredRole = requireRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      if (showAccessDenied) {
        if (isCreateCampaignPage) {
          return <CreateCampaignAccessDenied />;
        }
        return requireRoles.includes('admin') ? <AdminAccessDenied /> : <AccessDenied requiredRole={requireRoles[0]} />;
      }
      return null;
    }
  }

  if (requirePermissions.length > 0 && user) {
    const hasRequiredPermissions = requirePermissions.every(
      ({ resource, action }) => hasPermission(resource, action)
    );
    if (!hasRequiredPermissions) {
      if (showAccessDenied) {
        return <AccessDenied message="No tienes los permisos necesarios para realizar esta acción." />;
      }
      return null;
    }
  }

  return <>{children}</>;
};

// Convenience components for common use cases
export const AdminRoute: React.FC<{ children: ReactNode; showAccessDenied?: boolean }> = ({ 
  children, 
  showAccessDenied = true 
}) => (
  <ProtectedRoute requireRoles={['admin']} showAccessDenied={showAccessDenied}>
    {children}
  </ProtectedRoute>
);

export const CreateCampaignRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProtectedRoute requireRoles={['admin']} showAccessDenied={true} isCreateCampaignPage={true}>
    {children}
  </ProtectedRoute>
);

export const AuthenticatedRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProtectedRoute requireAuth={true}>
    {children}
  </ProtectedRoute>
);