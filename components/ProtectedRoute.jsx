import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const utilisateur = localStorage.getItem('utilisateurId');
    const token = localStorage.getItem('token');

    if (utilisateur && token) {
      setIsAuthenticated(true);
    } else {
      router.push('/utilisateurPage/login');
    }
  }, [router]);

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
