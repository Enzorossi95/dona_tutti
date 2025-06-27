'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';

interface PermissionMessageProps {
  requiredRole?: string;
  message?: string;
  showContactAdmin?: boolean;
  variant?: 'info' | 'warning';
}

export const PermissionMessage: React.FC<PermissionMessageProps> = ({
  requiredRole = 'admin',
  message,
  showContactAdmin = true,
  variant = 'info'
}) => {
  const { user } = useAuth();

  const defaultMessage = message || `Esta función requiere permisos de ${requiredRole === 'admin' ? 'administrador' : requiredRole}.`;
  
  const iconClass = variant === 'warning' ? 'text-amber-600' : 'text-blue-600';
  const alertClass = variant === 'warning' 
    ? 'border-amber-200 bg-amber-50' 
    : 'border-blue-200 bg-blue-50';

  return (
    <Alert className={alertClass}>
      <Shield className={`h-4 w-4 ${iconClass}`} />
      <AlertDescription className={variant === 'warning' ? 'text-amber-800' : 'text-blue-800'}>
        <div className="space-y-2">
          <p>{defaultMessage}</p>
          
          {user && (
            <p className="text-sm">
              Tu rol actual: <strong>{user.role?.name === 'admin' ? 'Administrador' : 'Invitado'}</strong>
            </p>
          )}
          
          {showContactAdmin && requiredRole === 'admin' && user?.role?.name !== 'admin' && (
            <div className="flex items-center space-x-2 mt-2">
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:admin@donaayuda.com?subject=Solicitud de permisos de administrador">
                  <Mail className="h-3 w-3 mr-1" />
                  Contactar Administrador
                </a>
              </Button>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Componente específico para botones bloqueados
export const BlockedButton: React.FC<{
  children: React.ReactNode;
  requiredRole?: string;
  tooltip?: string;
}> = ({ children, requiredRole = 'admin', tooltip }) => {
  const { user } = useAuth();
  const userRole = user?.role?.name;
  const hasPermission = requiredRole === 'admin' ? userRole === 'admin' : true;

  const defaultTooltip = `Requiere permisos de ${requiredRole === 'admin' ? 'administrador' : requiredRole}`;

  return (
    <div className="relative group">
      <div className={hasPermission ? '' : 'opacity-50 cursor-not-allowed'}>
        {React.cloneElement(children as React.ReactElement, {
          disabled: !hasPermission,
          onClick: hasPermission ? (children as React.ReactElement).props.onClick : undefined
        })}
      </div>
      
      {!hasPermission && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {tooltip || defaultTooltip}
        </div>
      )}
    </div>
  );
};

// Hook para verificar permisos fácilmente
export const usePermissions = () => {
  const { user } = useAuth();
  
  const hasRole = (role: string) => {
    return user?.role?.name === role;
  };

  const isAdmin = () => hasRole('admin');
  const isGuest = () => hasRole('guest');

  return {
    hasRole,
    isAdmin,
    isGuest,
    userRole: user?.role?.name || null
  };
};