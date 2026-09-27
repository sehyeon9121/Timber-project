import { networkInterfaces } from 'node:os';

// Match Vite's local and network URLs without trusting the request's Host header.
export function getDevelopmentOrigins() {
  const origins = new Set(['http://localhost:5173', 'http://127.0.0.1:5173', 'http://[::1]:5173']);
  for (const addresses of Object.values(networkInterfaces())) {
    for (const address of addresses || []) {
      if (address.family === 'IPv4' && !address.internal) origins.add(`http://${address.address}:5173`);
    }
  }
  return [...origins];
}
