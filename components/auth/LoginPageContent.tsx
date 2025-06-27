'use client';

import { useSearchParams } from 'next/navigation';
import { LoginForm } from './LoginForm';

export const LoginPageContent = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const message = searchParams.get('message');

  return <LoginForm redirectTo={redirectTo} successMessage={message || undefined} />;
};