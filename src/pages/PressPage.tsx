import { ArrowLeft, Play } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import { Container } from '@/components/atoms/Container';
import { Link } from '@/components/atoms/Link';
import { ContentSection } from '@/components/templates/ContentSection';
import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const pressPosts = [{
  id: '408oq-VpguU',
  title: '피라미드부터 800m 초고층 빌딩까지, 인간은 어떻게 이렇게 높이 쌓을 수 있었을까? (feat. 최경규 교수)',
  date: '2026. 9. 26.',
  dateTime: '2026-09-26',
  channel: 'EBS 컬렉션 - 사이언스',
  url: 'https://www.youtube.com/watch?v=408oq-VpguU',
  thumbnailUrl: 'https://i.ytimg.com/vi/408oq-VpguU/maxresdefault.jpg',
}];

export function PressPage() {
  const { language } = useLanguage();

  return (
    <DetailPageLayout title={language === 'KO' ? '언론보도' : 'Press Coverage'} noHeroImage heroMaxHeight={180}>
      <ContentSection background="white" padding="lg" animate={false}>
        <Container maxWidth="none" padding="none" className="max-w-[1000px]">
          <ul className="border-t-2 border-[var(--color-primary)]">
            {pressPosts.map(post => (
              <li key={post.id} className="border-b border-gray-200">
                <Link
                  href={`/news/press/${post.id}`}
                  className="flex flex-col gap-3 px-3 py-6 text-[var(--color-text)] hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] md:flex-row md:items-center md:justify-between md:gap-8 md:px-5"
                >
                  <span className="min-w-0 break-keep text-base font-semibold leading-relaxed md:text-lg">
                    {post.title}
                  </span>
                  <time className="shrink-0 text-sm font-normal text-gray-500 md:text-base" dateTime={post.dateTime}>
                    {post.date}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}

export function PressDetailPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const video = pressPosts.find(post => post.id === id);

  if (!video) return <Navigate to="/news/press" replace />;

  return (
    <DetailPageLayout title={language === 'KO' ? '언론보도' : 'Press Coverage'} noHeroImage>
      <ContentSection background="white" padding="lg" animate={false}>
        <Container maxWidth="none" padding="none" className="max-w-[1000px]">
          <Link href="/news/press" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--color-primary)]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {language === 'KO' ? '목록으로' : 'Back to list'}
          </Link>
          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <a
              className="group relative block aspect-video w-full overflow-hidden bg-black"
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={language === 'KO' ? 'YouTube에서 영상 재생' : 'Play video on YouTube'}
            >
              <img
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                src={video.thumbnailUrl}
                alt=""
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 md:h-20 md:w-20">
                  <Play className="ml-1 h-7 w-7 fill-current md:h-9 md:w-9" aria-hidden="true" />
                </span>
              </span>
            </a>
            <div className="p-5 md:p-8">
              <h2 className="text-xl font-semibold leading-relaxed text-[var(--color-text)] md:text-2xl">
                {video.title}
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                {video.channel} · <time dateTime={video.dateTime}>{video.date}</time>
              </p>
              <a
                className="mt-5 inline-flex text-sm font-medium text-[var(--color-primary)] underline underline-offset-4 hover:opacity-70"
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {language === 'KO' ? 'YouTube에서 보기' : 'Watch on YouTube'}
              </a>
            </div>
          </article>
        </Container>
      </ContentSection>
    </DetailPageLayout>
  );
}
