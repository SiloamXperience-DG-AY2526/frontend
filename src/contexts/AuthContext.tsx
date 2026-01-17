'use client';

import { getAuthUser, login, logout } from '@/lib/api/auth';
import { AuthUser, AuthPayload, AuthContextValue } from '@/types/AuthData';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext<AuthContextValue | null>(null);

// auth hook to use in pages
export function useAuth() {
  const authCtx = useContext(AuthContext);

  if (!authCtx) throw new Error('useAuth must be used within <AuthProvider />');

  return authCtx;
};

// auth provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const authLogin = useCallback(async (payload: AuthPayload): Promise<AuthUser> => { 
    const authUser = await login(payload);

    setUser(authUser);

    return authUser;
  }, []);

  const authLogout = useCallback( async () => {
    await logout();
    setUser(null);
  }, []);

  const authRefresh = useCallback(async () => {

    setIsLoading(true);

    const authUser = await getAuthUser();
    setUser(authUser);

    setIsLoading(false);
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const authUser = await getAuthUser();
        setUser(authUser);
      } catch (error) {
        // Silently fail if not authenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, authLogin, authLogout, authRefresh }),
    [user, isLoading, authLogin, authLogout, authRefresh]
  );

  return <AuthContext.Provider value={value}>{ children }</AuthContext.Provider>;
} 



