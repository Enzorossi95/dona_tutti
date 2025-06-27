'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { authUtils } from '@/lib/auth/authUtils';

export const ForgotPasswordForm: React.FC = () => {
  const { forgotPassword, isLoading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const validateForm = () => {
    if (!email) {
      setValidationError('El email es requerido');
      return false;
    }
    
    if (!authUtils.isValidEmail(email)) {
      setValidationError('Ingresa un email válido');
      return false;
    }
    
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await forgotPassword(email);
      setIsSuccess(true);
      // Note: In a real app, you wouldn't expose the reset token like this
      // This is just for development/testing purposes
    } catch (error: any) {
      console.error('Forgot password failed:', error);
    }
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    
    if (validationError) {
      setValidationError('');
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Email Enviado</CardTitle>
          <CardDescription className="text-center">
            Te hemos enviado las instrucciones para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Revisa tu bandeja de entrada en <strong>{email}</strong> y sigue las instrucciones para restablecer tu contraseña.
            </AlertDescription>
          </Alert>
          
          {/* Development only - show reset token */}
          {process.env.NODE_ENV === 'development' && resetToken && (
            <Alert>
              <AlertDescription>
                <strong>Solo para desarrollo:</strong> Token de reset: {resetToken}
                <br />
                <Link 
                  href={`/reset-password/${resetToken}`}
                  className="text-primary hover:underline"
                >
                  Ir a página de reset
                </Link>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Si no recibes el email en unos minutos, revisa tu carpeta de spam.
            </p>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setIsSuccess(false);
                setEmail('');
                setResetToken('');
              }}
            >
              Intentar con otro email
            </Button>
            
            <div className="text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">¿Olvidaste tu contraseña?</CardTitle>
        <CardDescription className="text-center">
          Ingresa tu email y te enviaremos instrucciones para restablecerla
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`pl-9 ${validationError ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
            </div>
            {validationError && (
              <p className="text-sm text-red-500">{validationError}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando instrucciones...
              </>
            ) : (
              'Enviar Instrucciones'
            )}
          </Button>

          <div className="text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};