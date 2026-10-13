import { useRef, type InputHTMLAttributes } from 'react';
import { Text } from '@/components/atoms/Text';
import { createInputSelectionGuard } from '@/lib/input-selection';
import styles from '@/styles/auth.module.css';

export interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  id: string;
}
export function AuthField({ label, hint, id, ...props }: AuthFieldProps) {
  const guardRef = useRef<ReturnType<typeof createInputSelectionGuard> | null>(null);
  if (guardRef.current === null) guardRef.current = createInputSelectionGuard();
  const guard = guardRef.current;
  return <div className={styles.field}>
    <label htmlFor={id}><Text weight={600}>{label}</Text></label>
    <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...props}
      onInput={event => {
        guard.input(event.currentTarget, (event.nativeEvent as InputEvent).isComposing);
        props.onInput?.(event);
      }}
      onSelect={event => { guard.select(event.currentTarget); props.onSelect?.(event); }}
      onKeyDown={event => { guard.clear(); props.onKeyDown?.(event); }}
      onPointerDown={event => { guard.clear(); props.onPointerDown?.(event); }}
      onBlur={event => { guard.clear(); props.onBlur?.(event); }}
      onCompositionStart={event => { guard.compositionStart(); props.onCompositionStart?.(event); }}
      onCompositionEnd={event => { guard.compositionEnd(); props.onCompositionEnd?.(event); }} />
    {hint && <small id={`${id}-hint`}>{hint}</small>}
  </div>;
}
