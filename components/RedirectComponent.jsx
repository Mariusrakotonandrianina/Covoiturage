import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const RedirectComponent = () => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const utilisateurId = localStorage.getItem('utilisateurId');
    if (token && utilisateurId) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (!authenticated && router.pathname !== '/utilisateurPage/login') {
      router.push('/utilisateurPage/login');
    }
  }, [authenticated]);

  return null;
};

export default RedirectComponent;
