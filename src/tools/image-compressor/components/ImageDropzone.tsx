// src/tools/image-compressor/components/ImageDropzone.tsx
import { useState, useRef, useEffect } from 'preact/hooks';

interface ImageDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function ImageDropzone({ onFileSelected, disabled }: ImageDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled || !e.dataTransfer?.files?.length) return;

    const file = e.dataTransfer.files[0];
    if (file.type.startsWith('image/')) {
      onFileSelected(file);
    }
  };

  const handleFileInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelected(file);
      }
      input.value = '';
    }
  };

  // Soporte para pegar desde el portapapeles (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled || !e.clipboardData) return;
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            onFileSelected(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [disabled, onFileSelected]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
      class={`relative w-full rounded-lg border-2 border-dashed transition-all cursor-pointer p-8 sm:p-10 text-center flex flex-col items-center justify-center gap-4 ${
        isDragOver
          ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100/80 dark:bg-neutral-800/60 scale-[0.995]'
          : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-900/30'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Zona para arrastrar o seleccionar una imagen"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
        class="hidden"
        onChange={handleFileInputChange}
        disabled={disabled}
      />

      {/* Ícono sobrio minimalista */}
      <div class="w-12 h-12 rounded-full bg-neutral-200/70 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>

      <div class="space-y-1.5 max-w-sm">
        <p class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          Arrastra tu imagen aquí o <span class="underline underline-offset-4 decoration-neutral-400">haz clic para explorar</span>
        </p>
        <p class="text-xs text-neutral-500 dark:text-neutral-400">
          También puedes pegar directamente con <kbd class="px-1.5 py-0.5 text-[10px] font-mono rounded bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">Ctrl+V</kbd>
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-1.5 pt-2">
        <span class="badge-tech">JPG</span>
        <span class="badge-tech">PNG</span>
        <span class="badge-tech">WEBP</span>
        <span class="badge-tech">AVIF</span>
        <span class="badge-tech">100% En Navegador</span>
      </div>
    </div>
  );
}
