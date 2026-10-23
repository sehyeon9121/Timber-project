import defaults from '../shared/research-results-defaults.json' with { type: 'json' };

const indicators = defaults.groups.flatMap(group => group.items);
const fields = ['first', 'second', 'completed', 'annualPlan', 'annualCompleted'];
export const reportingDate = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());

export function validateResearchResults(body) {
  if (!body || !Number.isSafeInteger(body.revision) || body.revision < 0
    || !Number.isInteger(body.year) || body.year < 2026 || body.year > 2030
    || !body.items || typeof body.items !== 'object' || Array.isArray(body.items)) return null;
  const asOfDate = body.asOfDate === '' || body.asOfDate === undefined ? reportingDate() : body.asOfDate;
  if (typeof asOfDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(asOfDate)) return null;
  const date = new Date(`${asOfDate}T00:00:00Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== asOfDate) return null;
  if (Object.keys(body.items).length !== indicators.length) return null;
  const items = {};
  for (const indicator of indicators) {
    const item = body.items[indicator.id];
    if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
    items[indicator.id] = {};
    for (const field of fields) {
      const value = item[field];
      if (value === null && !['first', 'second'].includes(field)) {
        items[indicator.id][field] = null;
      } else if (Number.isSafeInteger(value) && value >= 0 && value <= 1000000) {
        items[indicator.id][field] = value;
      } else return null;
    }
    if (item.completed !== null && item.annualCompleted !== null && item.completed < item.annualCompleted) return null;
  }
  return { year: body.year, asOfDate, items };
}

export function researchResultsStore(execute, rows) {
  return {
    async getResearchResults() {
      const record = (await rows('SELECT payload, revision, updated_at FROM research_results WHERE id = 1', []))[0];
      const saved = record ? JSON.parse(record.payload) : null;
      return {
        year: saved?.year ?? defaults.year,
        asOfDate: saved?.asOfDate ?? defaults.asOfDate,
        revision: record?.revision ?? 0,
        updatedAt: record?.updated_at ?? null,
        groups: defaults.groups.map(group => ({ ...group,
          items: group.items.map(item => ({ ...item, ...saved?.items[item.id] })),
        })),
      };
    },
    async saveResearchResults(input, revision, userId) {
      const args = [JSON.stringify(input), new Date().toISOString(), userId];
      const result = revision === 0
        ? await execute('INSERT INTO research_results (id, payload, revision, updated_at, updated_by) VALUES (1, ?, 1, ?, ?) ON CONFLICT(id) DO NOTHING', args)
        : await execute('UPDATE research_results SET payload = ?, revision = revision + 1, updated_at = ?, updated_by = ? WHERE id = 1 AND revision = ?', [...args, revision]);
      return Number(result.rowsAffected ?? result.changes) === 1;
    },
  };
}

export function registerResearchResultsRoutes(app, store, requireUser, requireAdmin) {
  app.get('/api/research/results', async (_request, response) => {
    response.json(await store.getResearchResults());
  });
  app.put('/api/admin/research/results', requireUser, requireAdmin, async (request, response) => {
    const input = validateResearchResults(request.body);
    if (!input) return response.status(400).json({ code: 'RESULTS_VALIDATION', message: '연도, 기준일과 0 이상의 정수를 확인해 주세요. 누적 실적은 연간 실적 이상이어야 합니다.' });
    if (!await store.saveResearchResults(input, request.body.revision, request.user.id)) {
      return response.status(409).json({ code: 'RESULTS_CONFLICT', message: '다른 화면에서 수정된 실적이 있습니다. 최신 내용을 다시 불러온 뒤 저장해 주세요.' });
    }
    response.json(await store.getResearchResults());
  });
}
