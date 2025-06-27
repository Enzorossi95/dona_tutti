'use client';

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, AlertTriangle } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireRoles?: string[];
  requirePermissions?: Array<{ resource: string; action: string }>;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requireRoles = [],
  requirePermissions = [],
  fallback,
  redirectTo = '/login'
}) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>
              Necesitas iniciar sesión para acceder a esta página
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full"
              onClick={() => router.push(redirectTo)}
            >
              Iniciar Sesión
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/')}
            >
              Ir al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role requirements
  if (requireRoles.length > 0 && user) {
    const hasRequiredRole = requireRoles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <CardTitle>Permisos Insuficientes</CardTitle>
              <CardDescription>
                No tienes los permisos necesarios para acceder a esta página
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  Se requiere uno de los siguientes roles: {requireRoles.join(', ')}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  Tu rol actual: <strong>{user.role?.name || 'Sin rol'}</strong>
                </p>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.back()}
                >
                  Volver Atrás
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/')}
                >
                  Ir al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Check permission requirements
  if (requirePermissions.length > 0 && user) {
    const hasRequiredPermissions = requirePermissions.every(
      ({ resource, action }) => hasPermission(resource, action)
    );
    
    if (!hasRequiredPermissions) {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <CardTitle>Permisos Insuficientes</CardTitle>
              <CardDescription>
                No tienes los permisos específicos necesarios para realizar esta acción
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  Se requieren permisos específicos que no posees actualmente.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  Contacta al administrador si crees que deberías tener acceso.
                </p>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.back()}
                >
                  Volver Atrás
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/')}
                >
                  Ir al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
};