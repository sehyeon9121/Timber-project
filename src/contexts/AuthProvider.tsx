import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '@/lib/auth-api';
import type { User } from '@/lib/auth-api';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await authApi<{ user: User | null }>('/auth/me');
      setUser(data.user);
      setError(null);
    } catch (cause) {
      setError(cause);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    authApi<{ user: User | null }>('/auth/me').then(data => {
      if (active) { setUser(data.user); setError(null); }
    }).catch(cause => { if (active) setError(cause); })
      .finally(() => { if (active) setLoading(false); });
    const expire = () => { setUser(null); setError(null); };
    window.addEventListener('auth:expired', expire);
    return () => { active = false; window.removeEventListener('auth:expired', expire); };
  }, []);
  const login = async (username: string, password: string) => {
    const data = await authApi<{ user: User }>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    setUser(data.user);
    setError(null);
    return data.user;
  };
  const logout = async () => {
    await authApi('/auth/logout', { method: 'POST' });
    setUser(null);
    setError(null);
  };
  return <AuthContext.Provider value={{ user, loading, error, refresh, login, logout }}>{children}</AuthContext.Provider>;
}
