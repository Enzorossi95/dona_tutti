import { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoginPageContent } from '@/components/auth/LoginPageContent';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | DonaAyuda',
  description: 'Inicia sesión en tu cuenta de DonaAyuda para gestionar campañas y donaciones.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">
            DonaAyuda
          </h1>
          <p className="text-gray-600">
            Plataforma de donaciones para rescate animal
          </p>
        </div>
        
        <Suspense fallback={<LoginForm />}>
          <LoginPageContent />
        </Suspense>
      </div>
    </div>
  );
}