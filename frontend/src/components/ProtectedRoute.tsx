import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  if (!authService.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 