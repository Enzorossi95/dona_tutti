import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Registrarse | DonaAyuda',
  description: 'Crea tu cuenta en DonaAyuda para comenzar a ayudar a los animales necesitados.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">
            DonaAyuda
          </h1>
          <p className="text-gray-600">
            Únete a nuestra comunidad de rescatistas
          </p>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
}