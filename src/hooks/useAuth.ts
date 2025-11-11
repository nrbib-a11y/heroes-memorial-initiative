import { useState, useCallback, useEffect } from 'react';

interface AuthState {
  authToken: string | null;
  userLogin: string | null;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => ({
    authToken: localStorage.getItem('authToken'),
    userLogin: localStorage.getItem('userLogin'),
    isAuthenticated: !!localStorage.getItem('authToken'),
  }));

  const login = useCallback((token: string, login: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userLogin', login);
    setAuthState({
      authToken: token,
      userLogin: login,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userLogin');
    setAuthState({
      authToken: null,
      userLogin: null,
      isAuthenticated: false,
    });
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'userLogin') {
        setAuthState({
          authToken: localStorage.getItem('authToken'),
          userLogin: localStorage.getItem('userLogin'),
          isAuthenticated: !!localStorage.getItem('authToken'),
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    ...authState,
    login,
    logout,
  };
}
