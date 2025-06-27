'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AuthAwareLinkProps {
  href: string;
  children: ReactNode;
  requireAuth?: boolean;
  requireRoles?: string[];
  requirePermissions?: Array<{ resource: string; action: string }>;
  fallbackComponent?: ReactNode;
  className?: string;
  onClick?: () => void;
  asButton?: boolean;
  buttonProps?: any;
}

export const AuthAwareLink: React.FC<AuthAwareLinkProps> = ({
  href,
  children,
  requireAuth = false,
  requireRoles = [],
  requirePermissions = [],
  fallbackComponent,
  className,
  onClick,
  asButton = false,
  buttonProps
}) => {
  const router = useRouter();
  const { isAuthenticated, user, hasRole, hasPermission, isLoading } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onClick) {
      onClick();
    }

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(href)}`;
      router.push(redirectUrl);
      return;
    }

    // Check role requirements
    if (requireRoles.length > 0 && user) {
      const hasRequiredRole = requireRoles.some(role => hasRole(role));
      if (!hasRequiredRole) {
        // Show error in console or you could implement a toast notification
        console.warn(`Access denied. Required roles: ${requireRoles.join(', ')}`);
        return;
      }
    }

    // Check permission requirements
    if (requirePermissions.length > 0 && user) {
      const hasRequiredPermissions = requirePermissions.every(
        ({ resource, action }) => hasPermission(resource, action)
      );
      if (!hasRequiredPermissions) {
        console.warn('Access denied. Insufficient permissions.');
        return;
      }
    }

    // All checks passed, navigate
    router.push(href);
  };

  // Loading state
  if (isLoading) {
    if (asButton) {
      return (
        <Button disabled {...buttonProps} className={className}>
          {children}
        </Button>
      );
    }
    return (
      <span className={className}>
        {children}
      </span>
    );
  }

  // Check if user has required permissions/roles for styling
  const hasAccess = (() => {
    if (requireAuth && !isAuthenticated) return false;
    
    if (requireRoles.length > 0 && user) {
      const hasRequiredRole = requireRoles.some(role => hasRole(role));
      if (!hasRequiredRole) return false;
    }
    
    if (requirePermissions.length > 0 && user) {
      const hasRequiredPermissions = requirePermissions.every(
        ({ resource, action }) => hasPermission(resource, action)
      );
      if (!hasRequiredPermissions) return false;
    }
    
    return true;
  })();

  // If user doesn't have access and fallback is provided
  if (!hasAccess && fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  // If user doesn't have access and no fallback, show disabled state
  if (!hasAccess) {
    if (asButton) {
      return (
        <Button disabled {...buttonProps} className={className} title="No tienes permisos para acceder">
          {children}
        </Button>
      );
    }
    return (
      <span className={`${className} opacity-50 cursor-not-allowed`} title="No tienes permisos para acceder">
        {children}
      </span>
    );
  }

  // User has access, render normal link/button
  if (asButton) {
    return (
      <Button onClick={handleClick} {...buttonProps} className={className}>
        {children}
      </Button>
    );
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

// Convenience component for admin links
export const AdminLink: React.FC<Omit<AuthAwareLinkProps, 'requireRoles'>> = (props) => (
  <AuthAwareLink requireRoles={['admin']} {...props} />
);

// Convenience component for authenticated user links
export const AuthenticatedLink: React.FC<Omit<AuthAwareLinkProps, 'requireAuth'>> = (props) => (
  <AuthAwareLink requireAuth={true} {...props} />
);

// Permission denial component
export const PermissionDenied: React.FC<{ message?: string }> = ({ 
  message = "No tienes permisos para realizar esta acción" 
}) => (
  <Alert variant="destructive" className="max-w-md">
    <AlertTriangle className="h-4 w-4" />
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);