import { useCallback, useEffect, useState } from 'react';
import { authApi } from '@/lib/auth-api';

interface Resource<T> { path: string; revision: number; data: T | null; error: unknown }
export function useBoardResource<T>(path: string | null) {
  const [revision, setRevision] = useState(0);
  const [resource, setResource] = useState<Resource<T> | null>(null);
  useEffect(() => {
    if (!path) return;
    let active = true;
    authApi<T>(path).then(data => {
      if (active) setResource({ path, revision, data, error: null });
    }).catch(error => {
      if (active) setResource({ path, revision, data: null, error });
    });
    return () => { active = false; };
  }, [path, revision]);
  const current = resource?.path === path && resource.revision === revision ? resource : null;
  const reload = useCallback(() => setRevision(value => value + 1), []);
  return { data: current?.data ?? null, error: current?.error, loading: path !== null && current === null, reload };
}
