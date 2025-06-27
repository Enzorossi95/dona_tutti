import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Restablecer Contraseña | DonaAyuda',
  description: 'Restablece tu contraseña de DonaAyuda.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">
            DonaAyuda
          </h1>
          <p className="text-gray-600">
            Restablece tu contraseña
          </p>
        </div>
        
        <ForgotPasswordForm />
      </div>
    </div>
  );
}