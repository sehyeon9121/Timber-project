import { useRef, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './FileDropzone.module.css';

export interface FileDropzoneProps {
  id: string;
  accept?: string;
  disabled?: boolean;
  describedBy?: string;
  onSelect: (files: File[]) => void;
}

export function FileDropzone({ id, accept, disabled = false, describedBy, onSelect }: FileDropzoneProps) {
  const { language } = useLanguage();
  const ko = language === 'KO';
  const input = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);

  return <div className={`${styles.dropzone} ${dragging && !disabled ? styles.dragging : ''} ${disabled ? styles.disabled : ''}`}
    role="group" aria-label={ko ? '파일·사진 첨부' : 'Attach files and photos'} aria-describedby={describedBy}
    onDragEnter={event => {
      event.preventDefault();
      if (disabled || !event.dataTransfer.types.includes('Files')) return;
      dragDepth.current++;
      setDragging(true);
    }}
    onDragOver={event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
    }}
    onDragLeave={event => {
      event.preventDefault();
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) setDragging(false);
    }}
    onDrop={event => {
      event.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      if (!disabled && event.dataTransfer.files.length) onSelect(Array.from(event.dataTransfer.files));
    }}>
    <Icon name="Upload" size={32} />
    <strong>{dragging && !disabled
      ? (ko ? '여기에 놓으면 첨부됩니다' : 'Drop files here to attach')
      : (ko ? '파일·사진을 여기에 드래그해서 놓으세요' : 'Drag and drop files or photos here')}</strong>
    <span>{ko ? '또는 내 PC에서 파일을 선택하세요' : 'Or choose files from your computer'}</span>
    <Button type="button" variant="outline" disabled={disabled} onClick={() => input.current?.click()} aria-controls={id}>
      {ko ? '파일 선택' : 'Choose files'}
    </Button>
    <input ref={input} id={id} type="file" multiple accept={accept} hidden disabled={disabled}
      aria-label={ko ? '파일·사진 선택' : 'Select files and photos'} aria-describedby={describedBy}
      onChange={event => {
        const files = Array.from(event.target.files ?? []);
        event.target.value = '';
        if (files.length) onSelect(files);
      }} />
  </div>;
}
