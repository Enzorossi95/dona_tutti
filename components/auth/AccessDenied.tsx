'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Home, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  requiredRole?: string;
  showContactInfo?: boolean;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = 'Acceso Restringido',
  message = 'No tienes los permisos necesarios para acceder a esta página.',
  requiredRole = 'admin',
  showContactInfo = true
}) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-gray-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {user && (
            <Alert>
              <AlertDescription>
                <strong>Tu rol actual:</strong> {user.role?.name || 'No definido'}
                <br />
                <strong>Rol requerido:</strong> {requiredRole}
              </AlertDescription>
            </Alert>
          )}

          {showContactInfo && (
            <Alert className="border-blue-200 bg-blue-50">
              <Mail className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                Para obtener permisos de {requiredRole}, contacta al administrador del sistema.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/campanas">
                Ver Campañas
              </Link>
            </Button>
            
            {showContactInfo && (
              <Button variant="outline" asChild>
                <Link href="mailto:admin@donaayuda.com?subject=Solicitud de permisos de administrador">
                  <Mail className="h-4 w-4 mr-2" />
                  Contactar Administrador
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Variantes específicas para diferentes escenarios
export const AdminAccessDenied: React.FC = () => (
  <AccessDenied
    title="Acceso de Administrador Requerido"
    message="Esta función está disponible solo para administradores."
    requiredRole="admin"
  />
);

export const AuthenticationRequired: React.FC = () => (
  <AccessDenied
    title="Inicio de Sesión Requerido"
    message="Necesitas iniciar sesión para acceder a esta página."
    showContactInfo={false}
  />
);