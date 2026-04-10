import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Icon } from '@/components/atoms/Icon';
import { useLanguage } from '@/contexts/LanguageContext';

export interface EmailModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
}

function EmailModalContent({ email, isOpen, onClose }: EmailModalProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [email]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
      }}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(2px)',
          cursor: 'pointer',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            width: '100%',
            maxWidth: 400,
            padding: 32,
            pointerEvents: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ fontSize: 20, fontWeight: 700, textAlign: 'center', color: '#000', marginBottom: 8 }}>
            {t('email.title')}
          </h3>

          <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>
            {t('email.subtitle')}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#f3f4f6',
            borderRadius: 8,
            padding: 16,
            marginBottom: copied ? 8 : 24,
          }}>
            <Icon name="Mail" size={18} className="text-gray-400" />
            <span style={{ flex: 1, fontSize: 15, color: '#000', textAlign: 'center', fontWeight: 500 }}>
              {email}
            </span>
            <button
              onClick={handleCopy}
              style={{
                flexShrink: 0,
                padding: 6,
                borderRadius: 6,
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
              title={t('email.copy')}
            >
              <Icon
                name={copied ? 'Check' : 'Copy'}
                size={18}
                className={copied ? 'text-green-600' : 'text-gray-500'}
              />
            </button>
          </div>

          {copied && (
            <p style={{ textAlign: 'center', fontSize: 13, color: '#16a34a', fontWeight: 500, marginBottom: 16 }}>
              {t('email.copied')}
            </p>
          )}

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px 0',
              backgroundColor: '#00380A',
              color: 'white',
              fontSize: 15,
              fontWeight: 500,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t('email.close')}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export function EmailModal(props: EmailModalProps) {
  return createPortal(<EmailModalContent {...props} />, document.body);
}
