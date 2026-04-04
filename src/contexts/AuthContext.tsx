'use client';

import { getAuthUser, login, logout } from '@/lib/api/auth';
import { AuthUser, AuthPayload, AuthContextValue, LoginResponse } from '@/types/AuthData';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext<AuthContextValue | null>(null);

// auth hook to use in pages
export function useAuth() {
    const authCtx = useContext(AuthContext);

    if (!authCtx) throw new Error('useAuth must be used within <AuthProvider />');

    return authCtx;
};

function isAuthUser(response: LoginResponse): response is AuthUser {
    return !('mustChangePassword' in response && response.mustChangePassword);
}

// auth provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const authLogin = useCallback(async (payload: AuthPayload): Promise<LoginResponse> => {
        const result = await login(payload);

        if ('mustChangePassword' in result && result.mustChangePassword) {
            return result;
        }

        if (isAuthUser(result)) {
            setUser(result);
        }

        return result;
    }, []);

    const authLogout = useCallback(async () => {
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
            // TEMPORARY: Inject provided bearer token
            document.cookie = 'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxZDk1ZjcwNy1jOTU0LTQ3MjItOTM5Mi1jNjMxNTBlNzc1ZjQiLCJyb2xlIjoicGFydG5lciIsImhhc09uYm9hcmRlZCI6ZmFsc2UsImlhdCI6MTc3MDEyNjEyMiwiZXhwIjoxNzcwMjEyNTIyfQ.nIlTvC-Qqr730kysgZ4hWWdaX7A9wmFcd5foMlWXC50; path=/';

            setIsLoading(true);
            try {
                const authUser = await getAuthUser();
                setUser(authUser);
            } catch {
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

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}



