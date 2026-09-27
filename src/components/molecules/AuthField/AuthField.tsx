import type { InputHTMLAttributes } from 'react';
import { Text } from '@/components/atoms/Text';
import styles from '@/styles/auth.module.css';

export interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  id: string;
}
export function AuthField({ label, hint, id, ...props }: AuthFieldProps) {
  return <div className={styles.field}>
    <label htmlFor={id}><Text weight={600}>{label}</Text></label>
    <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...props} />
    {hint && <small id={`${id}-hint`}>{hint}</small>}
  </div>;
}
