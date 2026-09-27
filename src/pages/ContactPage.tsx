import { motion } from 'framer-motion';
import { DetailPageLayout } from '@/components/templates/DetailPageLayout';
import { ContentSection } from '@/components/templates/ContentSection';
import { Heading } from '@/components/atoms/Heading';
import { Paragraph } from '@/components/atoms/Paragraph';
import { Link } from '@/components/atoms/Link';
import { Icon } from '@/components/atoms/Icon';
import { SocialIcon } from '@/components/molecules/SocialIcon';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/contexts/LanguageContext';

const socialLinks = [
  { platform: 'twitter' as const, href: 'https://twitter.com/terrerlab', label: 'Twitter' },
  { platform: 'google' as const, href: 'https://scholar.google.com/citations?user=HKJBpMAAAAAJ', label: 'Google Scholar' },
  { platform: 'github' as const, href: 'https://github.com/terrerlab', label: 'GitHub' },
];

export function ContactPage() {
  const { t } = useLanguage();

  const contactInfo = [
    {
      icon: 'MapPin' as const,
      title: t('contact.address'),
      content: ['MIT Building 48-216', '77 Massachusetts Ave', 'Cambridge, MA 02139'],
    },
    {
      icon: 'Mail' as const,
      title: t('contact.email'),
      content: ['cterrer@mit.edu'],
      isLink: true,
      linkPrefix: 'mailto:',
    },
    {
      icon: 'Phone' as const,
      title: t('contact.phone'),
      content: ['+1 (617) 253-1000'],
    },
  ];

  return (
    <DetailPageLayout
      title={t('contact.title')}
      subtitle={t('contact.subtitle')}
    >
      {/* Contact Information */}
      <ContentSection background="white" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="text-center md:text-left"
            >
              <div
                className={cn(
                  'inline-flex items-center justify-center',
                  'w-12 h-12 rounded-full mb-4',
                  'bg-[var(--color-primary)] bg-opacity-10'
                )}
              >
                <Icon
                  name={info.icon}
                  size={24}
                  className="text-[var(--color-primary)]"
                />
              </div>

              <Heading level={4} color="text" className="mb-2">
                {info.title}
              </Heading>

              {info.content.map((line, i) => (
                info.isLink ? (
                  <Link
                    key={i}
                    href={`${info.linkPrefix}${line}`}
                    variant="primary"
                    className="block"
                  >
                    {line}
                  </Link>
                ) : (
                  <Paragraph key={i} color="light" size="sm">
                    {line}
                  </Paragraph>
                )
              ))}
            </motion.div>
          ))}
        </div>
      </ContentSection>

      {/* Social Links */}
      <ContentSection background="light" padding="lg">
        <div className="text-center">
          <Heading level={3} color="text" className="mb-6">
            {t('contact.followUs')}
          </Heading>
          <div className="flex items-center justify-center gap-6">
            {socialLinks.map((social) => (
              <div key={social.platform} className="flex flex-col items-center gap-2">
                <SocialIcon
                  platform={social.platform}
                  href={social.href}
                  size="lg"
                  className="text-[var(--color-text)] hover:text-[var(--color-primary)]"
                />
                <span className="text-sm text-[var(--color-text-light)]">
                  {social.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* Map Placeholder */}
      <ContentSection background="white" padding="lg">
        <Heading level={3} color="text" className="mb-6 text-center">
          {t('contact.ourLocation')}
        </Heading>
        <div className="aspect-video bg-[var(--color-background)] rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.1777925455!2d-71.09416908454443!3d42.35980157918756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e370a5cb30cc5f%3A0xc53a8e6489686c87!2sMassachusetts%20Institute%20of%20Technology!5e0!3m2!1sen!2sus!4v1636566156735!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="MIT Location Map"
          />
        </div>
      </ContentSection>

      {/* Join Us */}
      <ContentSection background="primary" padding="lg">
        <div className="text-center text-white">
          <Heading level={2} color="white" className="mb-4">
            {t('contact.joinTeam')}
          </Heading>
          <Paragraph color="white" size="lg" className="mb-6 opacity-90 max-w-2xl mx-auto">
            {t('contact.joinTeamDescription')}
          </Paragraph>
          <Link
            href="mailto:cterrer@mit.edu?subject=Interest%20in%20Joining%20Terrer%20Lab"
            variant="white"
            className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
          >
            {t('contact.contactOpportunities')}
            <Icon name="ArrowRight" size={16} />
          </Link>
        </div>
      </ContentSection>
    </DetailPageLayout>
  );
}
