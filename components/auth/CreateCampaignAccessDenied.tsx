'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Home, List, Mail } from 'lucide-react';

export const CreateCampaignAccessDenied: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">DonaTutti</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Crear Campaña
            </CardTitle>
            <CardDescription className="text-gray-600">
              Funcionalidad disponible para administradores
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Mail className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                <div className="space-y-2">
                  <p className="font-medium">
                    Para crear campañas de donación, necesitas permisos especiales.
                  </p>
                  <p className="text-sm">
                    Si representas una organización o fundación y deseas crear campañas, 
                    por favor contáctanos para evaluar tu solicitud.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Contacto para soporte:</h4>
              <div className="flex items-center space-x-2 text-blue-600">
                <Mail className="h-4 w-4" />
                <a 
                  href="mailto:hola@donatutti.com?subject=Solicitud para crear campañas"
                  className="hover:underline"
                >
                  hola@donatutti.com
                </a>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link href="/campanas">
                  <List className="h-4 w-4 mr-2" />
                  Ver Campañas Disponibles
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Volver al Inicio
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};