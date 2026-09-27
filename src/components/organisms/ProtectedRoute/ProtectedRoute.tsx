import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { authErrorMessage } from '@/lib/auth-api';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { Button } from '@/components/atoms/Button';

export function ProtectedRoute({ children, masterOnly = false }: { children: ReactNode; masterOnly?: boolean }) {
  const { user, loading, error, refresh } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const ko = language === 'KO';
  if (loading || error) return <AuthLayout title={ko ? '회원 공간' : 'Member area'} description={loading ? (ko ? '로그인 상태를 확인하고 있습니다.' : 'Checking your session…') : authErrorMessage(error, language)}>
    {!loading && <Button onClick={() => void refresh()}>{ko ? '다시 시도' : 'Try again'}</Button>}
  </AuthLayout>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (masterOnly && user.role !== 'master') return <Navigate to="/members" replace />;
  return children;
}
