import { useEffect, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { authApi, authErrorMessage } from '@/lib/auth-api';
import { achievementRate } from '@/data/researchResults';
import type { ResearchResults, ResultValues } from '@/data/researchResults';
import styles from './ResearchResultsEditor.module.css';

function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export function ResearchResultsEditor({ onSaved }: { onSaved?: () => void }) {
  const { language } = useLanguage();
  const ko = language === 'KO';
  const [data, setData] = useState<ResearchResults | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [date, setDate] = useState(today);
  useEffect(() => {
    let active = true;
    authApi<ResearchResults>('/research/results').then(result => {
      if (active) { setData(result); setDate(today()); }
    }).catch(cause => { if (active) setError(cause); });
    return () => { active = false; };
  }, []);
  async function reload() {
    setBusy(true); setNotice(''); setError(null);
    try {
      const result = await authApi<ResearchResults>('/research/results');
      setData(result); setDate(today());
    } catch (cause) { setError(cause); }
    finally { setBusy(false); }
  }
  function change(id: string, field: keyof ResultValues, value: string) {
    setNotice('');
    setData(current => current && ({ ...current, groups: current.groups.map(group => ({ ...group,
      items: group.items.map(item => item.id === id ? { ...item, [field]: value === '' ? null : Number(value) } : item),
    })) }));
  }
  async function save() {
    if (!data) return;
    setBusy(true); setError(null); setNotice('');
    const items = Object.fromEntries(data.groups.flatMap(group => group.items).map(item => [item.id, {
      first: item.first, second: item.second, completed: item.completed,
      annualPlan: item.annualPlan, annualCompleted: item.annualCompleted,
    }]));
    try {
      const saved = await authApi<ResearchResults>('/admin/research/results', {
        method: 'PUT', body: JSON.stringify({ year: data.year, asOfDate: date, revision: data.revision, items }),
      });
      setData(saved); setDate(saved.asOfDate ?? today());
      setNotice(ko ? '연구성과와 집계 기준일을 저장했습니다.' : 'Research results and the reporting date have been saved.');
      onSaved?.();
    } catch (cause) { setError(cause); }
    finally { setBusy(false); }
  }
  const columns: { key: keyof ResultValues; label: string; required?: boolean }[] = [
    { key: 'first', label: ko ? '1단계 목표' : 'Phase 1 target', required: true },
    { key: 'second', label: ko ? '2단계 목표' : 'Phase 2 target', required: true },
    { key: 'annualPlan', label: ko ? '연간 계획' : 'Annual plan' },
    { key: 'annualCompleted', label: ko ? '연간 달성' : 'Annual achieved' },
    { key: 'completed', label: ko ? '누적 달성' : 'Cumulative achieved' },
  ];
  return <div className={styles.editor}>
    <h2>{ko ? '연구성과 관리' : 'Research Results Management'}</h2>
    <p>{ko ? '연간 계획·실적과 전체 연구기간의 누적 실적을 구분해 입력하세요. 빈칸은 미집계, 0은 확인된 실적 0건입니다.' : 'Enter annual plans and results separately from cumulative results for the entire project. Leave unreported values blank; 0 means a confirmed zero.'}</p>
    {Boolean(error) && <p role="alert" className={styles.error}>{authErrorMessage(error, language)}</p>}
    {notice && <p role="status" className={styles.notice}>{notice}</p>}
    {data?.asOfDate && <p>{ko ? `현재 공개된 집계 기준일: ${data.asOfDate}` : `Published reporting date: ${data.asOfDate}`}</p>}
    {!data ? <>
      {!error && <p role="status">{ko ? '실적을 불러오는 중…' : 'Loading results…'}</p>}
      {Boolean(error) && <Button onClick={() => void reload()} disabled={busy}>{ko ? '다시 시도' : 'Try again'}</Button>}
    </> : <form onSubmit={event => { event.preventDefault(); void save(); }}>
      <fieldset disabled={busy}>
        <legend className="sr-only">{ko ? '연구성과 입력' : 'Edit research results'}</legend>
        <div className={styles.settings}>
          <label>{ko ? '실적 연도' : 'Reporting year'}<select value={data.year} onChange={event => { setData({ ...data, year: Number(event.target.value) }); setNotice(''); }}>
            {[2026, 2027, 2028, 2029, 2030].map(year => <option key={year} value={year}>{year}</option>)}
          </select></label>
          <label>{ko ? '집계 기준일' : 'Reporting date'}<input type="date" value={date} onChange={event => { setDate(event.target.value); setNotice(''); }} required /></label>
          <Button type="button" variant="outline" onClick={() => { setDate(today()); setNotice(''); }}>{ko ? '오늘 날짜 사용' : 'Use today’s date'}</Button>
        </div>
        <p className={styles.help}>{ko ? '이미지의 7개 지표는 2026년 초기 입력값으로 반영했습니다. 나머지 지표의 연간 계획·실적은 확인 후 입력하세요.' : 'The seven supplied indicators are included as initial 2026 values. Enter annual plans and results for the remaining indicators when confirmed.'}</p>
        <div className={styles.scroll} tabIndex={0} role="region" aria-label={ko ? '연구성과 편집 표' : 'Research results editor table'}>
          <table>
            <caption className="sr-only">{ko ? '12개 연구성과 지표의 목표와 실적 편집' : 'Edit targets and results for 12 research indicators'}</caption>
            <thead><tr><th scope="col">{ko ? '성과지표' : 'Indicator'}</th>{columns.map(column => <th key={column.key} scope="col">{column.label}</th>)}<th scope="col">{ko ? '연간 달성률' : 'Annual rate'}</th></tr></thead>
            {data.groups.map(group => <tbody key={group.id}>
              <tr><th colSpan={7} scope="rowgroup" className={styles.group}>{ko ? group.title.ko : group.title.en}</th></tr>
              {group.items.map(item => <tr key={item.id}>
                <th scope="row">{ko ? item.label.ko : item.label.en}</th>
                {columns.map(column => <td key={column.key}><input type="number" min={0} max={1000000} step={1} required={column.required}
                  value={item[column.key] ?? ''} aria-label={`${ko ? item.label.ko : item.label.en} ${column.label}`}
                  onChange={event => change(item.id, column.key, event.target.value)} /></td>)}
                <td>{achievementRate(item.annualPlan, item.annualCompleted)}%</td>
              </tr>)}
            </tbody>)}
          </table>
        </div>
        <div className={styles.actions}>
          <Button type="submit">{busy ? (ko ? '저장 중…' : 'Saving…') : (ko ? '저장 및 공개 페이지 반영' : 'Save and update public page')}</Button>
          <Button type="button" variant="outline" onClick={() => void reload()}>{ko ? '저장된 내용 다시 불러오기' : 'Reload saved values'}</Button>
          <a href="/results" target="_blank" rel="noopener noreferrer">{ko ? '연구개발 페이지 보기' : 'View research results'}</a>
        </div>
      </fieldset>
    </form>}
  </div>;
}
