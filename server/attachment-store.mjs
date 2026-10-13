// Both SQLite and Turso use the same attachment metadata and ownership rules.
export function attachmentStore(execute, rows) {
  const owner = kind => kind === 'posts' ? 'post_id' : 'notice_id';
  return {
    async listAttachments(kind, id, includePending = false) {
      return rows(`SELECT id, name, size, content_type AS contentType, state FROM attachments
        WHERE ${owner(kind)} = ? ${includePending ? '' : "AND state = 'ready'"} ORDER BY created_at, id`, [id]);
    },
    async findAttachment(id) {
      return (await rows('SELECT * FROM attachments WHERE id = ?', [id]))[0];
    },
    async reserveAttachment(kind, parentId, file) {
      const column = owner(kind);
      await execute(`INSERT INTO attachments (id, ${column}, name, size, content_type, pathname, backend)
        SELECT ?, ?, ?, ?, ?, ?, ? WHERE (SELECT count(*) FROM attachments WHERE ${column} = ?) < 10`,
      [file.id, parentId, file.name, file.size, file.contentType, file.pathname, file.backend, parentId]);
      return this.findAttachment(file.id);
    },
    readyAttachment: id => execute("UPDATE attachments SET state = 'ready' WHERE id = ?", [id]),
    deleteAttachment: id => execute('DELETE FROM attachments WHERE id = ?', [id]),
    allAttachmentFiles: (kind, id) => rows(`SELECT * FROM attachments WHERE ${owner(kind)} = ?`, [id]),
  };
}
