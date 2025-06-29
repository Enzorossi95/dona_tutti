'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authContext';

interface UserInfoProps {
  showLogout?: boolean;
  showRole?: boolean;
  className?: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({ 
  showLogout = true, 
  showRole = true, 
  className = '' 
}) => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  // Handle logout with redirect to home
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return 'default'; // Blue
      case 'guest':
        return 'secondary'; // Gray
      default:
        return 'outline';
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'guest':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* User Avatar/Icon */}
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-orange-600" />
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email.split('@')[0]}
          </span>
          {showRole && user.role && (
            <Badge 
              variant={getRoleBadgeVariant(user.role.name)}
              className={`text-xs w-fit ${getRoleColor(user.role.name)}`}
            >
              {user.role.name === 'admin' ? 'Administrador' : 'Invitado'}
            </Badge>
          )}
        </div>
      </div>

      {/* Logout Button */}
      {showLogout && (
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      )}
    </div>
  );
};

// Variante compacta para navbar
export const UserInfoCompact: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <User className="h-4 w-4" />
      <span>{user.firstName || user.email.split('@')[0]}</span>
      {user.role && (
        <Badge variant="outline" className="text-xs">
          {user.role.name === 'admin' ? 'Admin' : 'Guest'}
        </Badge>
      )}
    </div>
  );
};