/**
 * EXAMPLE: Cómo usar AuthAwareLink para navegación inteligente
 * 
 * Este archivo muestra ejemplos de cómo usar el componente AuthAwareLink
 * para manejar automáticamente la redirección de autenticación.
 */

'use client';

import { Button } from '@/components/ui/button';
import { Plus, Shield, User } from 'lucide-react';
import { AuthAwareLink, AdminLink, AuthenticatedLink, PermissionDenied } from './AuthAwareLink';

export const AuthAwareLinkExample = () => {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Ejemplos de AuthAwareLink</h2>
      
      {/* Botón para crear campaña - requiere rol admin */}
      <AdminLink
        href="/admin/campanas/crear"
        asButton
        buttonProps={{
          className: "bg-green-600 hover:bg-green-700"
        }}
        fallbackComponent={
          <PermissionDenied message="Solo los administradores pueden crear campañas" />
        }
      >
        <Plus className="h-4 w-4 mr-2" />
        Crear Campaña
      </AdminLink>

      {/* Link para dashboard admin - requiere rol admin */}
      <AdminLink
        href="/admin"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        fallbackComponent={
          <span className="text-gray-500">Dashboard (Solo admins)</span>
        }
      >
        <Shield className="h-4 w-4 mr-2" />
        Dashboard Admin
      </AdminLink>

      {/* Link que requiere autenticación */}
      <AuthenticatedLink
        href="/perfil"
        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        fallbackComponent={
          <AuthAwareLink
            href="/perfil"
            requireAuth
            className="inline-flex items-center px-4 py-2 bg-gray-400 text-white rounded cursor-pointer"
          >
            <User className="h-4 w-4 mr-2" />
            Mi Perfil (Iniciar sesión)
          </AuthAwareLink>
        }
      >
        <User className="h-4 w-4 mr-2" />
        Mi Perfil
      </AuthenticatedLink>

      {/* Ejemplo con permisos específicos */}
      <AuthAwareLink
        href="/admin/usuarios"
        requirePermissions={[{ resource: 'users', action: 'manage' }]}
        asButton
        buttonProps={{ variant: "outline" }}
        fallbackComponent={
          <Button disabled variant="outline" title="Permisos insuficientes">
            Gestionar Usuarios
          </Button>
        }
      >
        Gestionar Usuarios
      </AuthAwareLink>

      {/* Link normal sin restricciones */}
      <AuthAwareLink
        href="/campanas"
        className="text-blue-600 hover:underline"
      >
        Ver Campañas Públicas
      </AuthAwareLink>
    </div>
  );
};

// Ejemplo de uso en una navbar
export const NavbarWithAuth = () => {
  return (
    <nav className="flex items-center space-x-4 p-4 bg-white shadow">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <h1 className="text-xl font-bold text-orange-600">DonaAyuda</h1>
        
        {/* Navigation Links */}
        <AuthAwareLink href="/campanas" className="hover:text-orange-600">
          Campañas
        </AuthAwareLink>
        
        <AuthenticatedLink href="/mis-donaciones" className="hover:text-orange-600">
          Mis Donaciones
        </AuthenticatedLink>
        
        <AdminLink href="/admin" className="hover:text-orange-600">
          Admin
        </AdminLink>
      </div>
      
      <div className="ml-auto flex items-center space-x-2">
        {/* Crear Campaña Button */}
        <AdminLink
          href="/admin/campanas/crear"
          asButton
          buttonProps={{
            className: "bg-green-600 hover:bg-green-700",
            size: "sm"
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Campaña
        </AdminLink>
        
        {/* Login/Profile */}
        <AuthenticatedLink
          href="/perfil"
          asButton
          buttonProps={{ variant: "outline", size: "sm" }}
          fallbackComponent={
            <AuthAwareLink
              href="/login"
              asButton
              buttonProps={{ size: "sm" }}
            >
              Iniciar Sesión
            </AuthAwareLink>
          }
        >
          <User className="h-4 w-4 mr-2" />
          Mi Perfil
        </AuthenticatedLink>
      </div>
    </nav>
  );
};