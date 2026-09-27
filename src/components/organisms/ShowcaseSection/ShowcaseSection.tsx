import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heading } from '@/components/atoms/Heading';
import { Paragraph } from '@/components/atoms/Paragraph';
import { Spacer } from '@/components/atoms/Spacer';
import { cn } from '@/utils/cn';

export interface ShowcaseSectionProps {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt: string;
  boxTitle: string;
  boxDescription: string;
  className?: string;
}

export function ShowcaseSection({
  title,
  subtitle,
  image,
  imageAlt,
  boxTitle,
  boxDescription,
  className,
}: ShowcaseSectionProps) {
  return (
    <section className={cn('w-full flex flex-col items-center px-5 py-12 md:py-16', className)}>
      {/* Top Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center"
        style={{ maxWidth: '900px', margin: '0 auto' }}
      >
        <Heading level={2} style={{ fontWeight: 800, color: '#1B3A4B' }}>
          {title}
        </Heading>
        {subtitle && (
          <>
            <Spacer size="md" />
            <Paragraph color="light" size="lg" className="leading-relaxed">
              {subtitle}
            </Paragraph>
          </>
        )}
      </motion.div>

      <Spacer size="2xl" />

      {/* Large Image */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full md:w-[65%] max-w-[700px]"
      >
        <div
          className="bg-white rounded-xl border border-gray-200 drop-shadow-lg"
          style={{ padding: '20px' }}
        >
          <img
            src={image}
            alt={imageAlt}
            className="w-full aspect-[16/10] max-h-[420px] object-contain"
          />
        </div>
      </motion.div>

      {/* Bottom Box - 20px gap from image */}
      <Link to="/showcase" className="block no-underline w-full md:w-[65%] max-w-[700px]" style={{ marginTop: '20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gray-100 rounded-xl text-center border border-gray-200 shadow-sm cursor-pointer transition-shadow hover:shadow-md"
          style={{ padding: '18px' }}
        >
          <Heading level={4} style={{ fontWeight: 700, color: '#1B3A4B', marginBottom: '8px' }}>
            {boxTitle}
          </Heading>
          <Paragraph color="light" size="sm" className="leading-relaxed">
            {boxDescription}
          </Paragraph>
        </motion.div>
      </Link>
    </section>
  );
}
