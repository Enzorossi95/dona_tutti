import { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Restablecer Contraseña | DonaAyuda',
  description: 'Establece tu nueva contraseña para tu cuenta de DonaAyuda.',
};

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">
            DonaAyuda
          </h1>
          <p className="text-gray-600">
            Establece tu nueva contraseña
          </p>
        </div>
        
        <ResetPasswordForm token={params.token} />
      </div>
    </div>
  );
}