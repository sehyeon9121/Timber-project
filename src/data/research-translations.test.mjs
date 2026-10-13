import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const source = read('./researchTranslations.ts');
const translations = JSON.parse(source.slice(source.indexOf('{'), source.lastIndexOf('}') + 1));
const hasKorean = text => /[가-힣]/u.test(text);

function assertTranslated(text) {
  if (!hasKorean(text)) return;
  assert.ok(translations[text]?.trim(), `Missing English translation: ${text}`);
  assert.ok(!hasKorean(translations[text]), `Korean remains in English translation: ${text}`);
}

test('all research tasks, stage titles, and image descriptions have English translations', () => {
  for (const name of ['TerrestrialCarbon', 'NaturalClimate', 'EnergyPerformance', 'SmartConstruction']) {
    const content = read(`../components/organisms/ResearchDetailContent/${name}Detail.tsx`);
    for (const match of content.matchAll(/(?:title|alt):\s*(['"])(.*?)\1/gu)) assertTranslated(match[2]);
  }
});

test('all framework cards, topics, goals, and interface labels have English translations', () => {
  const framework = read('./researchStrategy.ts');
  for (const match of framework.matchAll(/(?:number|title|label|topic|text):\s*(['"])(.*?)\1/gu)) assertTranslated(match[2]);
  const page = read('../pages/ResearchStrategyPage.tsx');
  for (const match of page.matchAll(/tr\((['"])(.*?)\1\)/gu)) assertTranslated(match[2]);
});

test('the common translation dictionary has matching Korean and English keys', () => {
  const context = read('../contexts/LanguageContext.tsx');
  const en = context.slice(context.indexOf('  EN: {'), context.indexOf('  KO: {'));
  const ko = context.slice(context.indexOf('  KO: {'), context.indexOf('interface LanguageProviderProps'));
  const keys = text => [...text.matchAll(/^\s*'([^']+)':/gmu)].map(match => match[1]).sort();
  assert.deepEqual(keys(en), keys(ko));
});

test('all Korean participating institution names have English names', () => {
  const partners = read('./partnerships.ts');
  const names = [...partners.matchAll(/name:\s*'([^']+)'/gu)].map(match => match[1]).filter(hasKorean);
  for (const name of names) assert.ok(partners.includes(`'${name}': '`), `Missing institution name: ${name}`);
});
