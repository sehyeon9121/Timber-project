import { mkdir, stat, writeFile, unlink } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { Readable } from 'node:stream';
import { del, get, head } from '@vercel/blob';

export function createFileStorage(environment = process.env) {
  const token = environment.BLOB_READ_WRITE_TOKEN?.trim();
  if (token) return {
    backend: 'blob', token,
    async inspect(file) {
      const info = await head(file.pathname, { token });
      if (!new URL(info.url).hostname.endsWith('.private.blob.vercel-storage.com')) throw new Error('PRIVATE_STORAGE_REQUIRED');
      return { size: info.size, contentType: info.contentType };
    },
    async read(file) {
      const result = await get(file.pathname, { access: 'private', token, useCache: false });
      if (result?.statusCode !== 200) return null;
      return Readable.fromWeb(result.stream);
    },
    remove: file => del(file.pathname, { token }),
  };
  // Serverless deployments must never place files on an ephemeral disk.
  if (environment.VERCEL || environment.NODE_ENV === 'production') return null;
  const directory = resolve(environment.ATTACHMENT_DIR || 'server/data/attachments');
  const path = file => resolve(directory, file.id); // IDs are server-generated UUIDs.
  return {
    backend: 'local',
    async write(file, data) {
      await mkdir(directory, { recursive: true });
      await writeFile(path(file), data, { flag: 'wx' });
    },
    async inspect(file) { return { size: (await stat(path(file))).size, contentType: file.content_type }; },
    async read(file) {
      try { await stat(path(file)); return createReadStream(path(file)); }
      catch (error) { if (error.code === 'ENOENT') return null; throw error; }
    },
    async remove(file) {
      try { await unlink(path(file)); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
    },
  };
}
