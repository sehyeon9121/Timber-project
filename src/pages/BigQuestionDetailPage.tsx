import { useParams, Navigate } from 'react-router-dom';
import { PageLayout } from '@/components/templates/PageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { BigQuestionContent } from '@/components/organisms/BigQuestionContent';
import { Link } from '@/components/atoms/Link';
import { Icon } from '@/components/atoms/Icon';
import { bigQuestions } from '@/data/bigQuestions';
import { useLanguage } from '@/contexts/LanguageContext';

export function BigQuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  const question = bigQuestions.find(q => q.id === Number(id));

  if (!question) {
    return <Navigate to="/big-questions" replace />;
  }

  // Get adjacent questions for navigation
  const currentIndex = bigQuestions.findIndex(q => q.id === question.id);
  const prevQuestion = currentIndex > 0 ? bigQuestions[currentIndex - 1] : null;
  const nextQuestion = currentIndex < bigQuestions.length - 1 ? bigQuestions[currentIndex + 1] : null;

  return (
    <PageLayout>
      {/* Back Link */}
      <ContentSection background="white" padding="sm" className="pt-24">
        <Link
          href="/"
          variant="muted"
          className="inline-flex items-center gap-2 hover:text-[var(--color-primary)]"
        >
          <Icon name="ArrowLeft" size={16} />
          {t('bigQuestions.backTo')}
        </Link>
      </ContentSection>

      {/* Main Content */}
      <ContentSection background="white" padding="lg">
        <BigQuestionContent {...question} />
      </ContentSection>

      {/* Navigation */}
      <ContentSection background="light" padding="lg">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {prevQuestion ? (
            <Link
              href={`/big-questions/${prevQuestion.id}`}
              variant="muted"
              className="flex items-center gap-2 hover:text-[var(--color-primary)]"
            >
              <Icon name="ArrowLeft" size={16} />
              <span className="line-clamp-1">{prevQuestion.question}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextQuestion && (
            <Link
              href={`/big-questions/${nextQuestion.id}`}
              variant="muted"
              className="flex items-center gap-2 hover:text-[var(--color-primary)] text-right"
            >
              <span className="line-clamp-1">{nextQuestion.question}</span>
              <Icon name="ArrowRight" size={16} />
            </Link>
          )}
        </div>
      </ContentSection>
    </PageLayout>
  );
}
