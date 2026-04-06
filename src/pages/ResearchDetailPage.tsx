import { useParams, Navigate } from 'react-router-dom';
import { PageLayout } from '@/components/templates/PageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { ResearchDetailContent } from '@/components/organisms/ResearchDetailContent';
import { Link } from '@/components/atoms/Link';
import { Icon } from '@/components/atoms/Icon';
import { researchThemes } from '@/data/researchThemes';
import { useLanguage } from '@/contexts/LanguageContext';

const themeKeyMap: Record<string, string> = {
  'terrestrial-carbon': 'terrestrialCarbon',
  'natural-climate': 'naturalClimate',
  'smart-construction': 'smartConstruction',
  'energy-performance': 'energyPerformance',
};

export function ResearchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  const theme = researchThemes.find(th => th.id === id);

  if (!theme) {
    return <Navigate to="/" replace />;
  }

  const currentIndex = researchThemes.findIndex(th => th.id === id);
  const prevTheme = currentIndex > 0 ? researchThemes[currentIndex - 1] : null;
  const nextTheme = currentIndex < researchThemes.length - 1 ? researchThemes[currentIndex + 1] : null;

  const translatedTitle = t(`researchDetail.${themeKeyMap[theme.id] || theme.id}.title`);
  const translatedDescription = t(`researchDetail.${themeKeyMap[theme.id] || theme.id}.description`);

  return (
    <PageLayout>
      {/* Back Link */}
      <ContentSection background="white" padding="sm" className="pt-24">
        <div className="max-w-4xl" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <Link
            href="/"
            variant="muted"
            className="inline-flex items-center gap-2 hover:text-[var(--color-primary)]"
          >
            <Icon name="ArrowLeft" size={16} />
            {t('home.research.title')}
          </Link>
        </div>
      </ContentSection>

      {/* Main Content */}
      <ContentSection background="white" padding="lg">
        <ResearchDetailContent
          id={theme.id}
          title={translatedTitle}
          description={translatedDescription}
          backgroundImage={theme.backgroundImage || '/images/leeseunglab/hero-background.jpg'}
        />
      </ContentSection>

      {/* Navigation between research themes */}
      <ContentSection background="light" padding="lg">
        <div className="max-w-4xl flex flex-col sm:flex-row justify-between gap-4" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          {prevTheme ? (
            <Link
              href={`/research/${prevTheme.id}`}
              variant="muted"
              className="flex items-center gap-2 hover:text-[var(--color-primary)]"
            >
              <Icon name="ArrowLeft" size={16} />
              <span className="line-clamp-1">
                {t(`research.${themeKeyMap[prevTheme.id] || prevTheme.id}.title`)}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextTheme && (
            <Link
              href={`/research/${nextTheme.id}`}
              variant="muted"
              className="flex items-center gap-2 hover:text-[var(--color-primary)] text-right"
            >
              <span className="line-clamp-1">
                {t(`research.${themeKeyMap[nextTheme.id] || nextTheme.id}.title`)}
              </span>
              <Icon name="ArrowRight" size={16} />
            </Link>
          )}
        </div>
      </ContentSection>
    </PageLayout>
  );
}
