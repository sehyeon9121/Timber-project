import { createContext, useContext } from 'react';
import type { User } from '@/lib/auth-api';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: unknown;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}
export const AuthContext = createContext<AuthState | undefined>(undefined);
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
