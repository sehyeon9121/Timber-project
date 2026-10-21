import { useCallback, useEffect, useRef, useState } from 'react';
import { authApi } from '@/lib/auth-api';

interface Resource<T> { path: string; method: string; revision: number; data: T | null; error: unknown }
export function useBoardResource<T>(path: string | null, method: 'GET' | 'POST' = 'GET') {
  const [revision, setRevision] = useState(0);
  const [resource, setResource] = useState<Resource<T> | null>(null);
  const request = useRef<{ path: string; method: string; revision: number; promise: Promise<T> } | null>(null);
  useEffect(() => {
    if (!path) return;
    let active = true;
    // Reuse the request when StrictMode replays this effect, including view writes.
    if (request.current?.path !== path || request.current.method !== method || request.current.revision !== revision) {
      request.current = { path, method, revision, promise: authApi<T>(path, { method }) };
    }
    request.current.promise.then(data => {
      if (active) setResource({ path, method, revision, data, error: null });
    }).catch(error => {
      if (active) setResource({ path, method, revision, data: null, error });
    });
    return () => { active = false; };
  }, [path, method, revision]);
  const current = resource?.path === path && resource.method === method && resource.revision === revision ? resource : null;
  const reload = useCallback(() => setRevision(value => value + 1), []);
  return { data: current?.data ?? null, error: current?.error, loading: path !== null && current === null, reload };
}
