'use client';

import { useRef } from 'react';
import { FileText, ImagePlus, X } from 'lucide-react';

interface NotesSectionProps {
  notes: string;
  onNotesChange: (v: string) => void;
  screenshotDataUrl: string | null;
  onScreenshotChange: (v: string | null) => void;
}

export function NotesSection({
  notes,
  onNotesChange,
  screenshotDataUrl,
  onScreenshotChange,
}: NotesSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onScreenshotChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
        <FileText className="mr-1 inline h-3.5 w-3.5" />
        Notes & Screenshot
      </label>

      {/* Notes textarea */}
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Why did I take this trade? What's the setup?"
        rows={3}
        className="input-trade w-full resize-none"
      />
      <p className="mt-1 text-right text-[10px] text-[var(--color-text-muted)]">
        {notes.length}/500
      </p>

      {/* Screenshot upload */}
      {screenshotDataUrl ? (
        <div className="relative mt-2">
          <img
            src={screenshotDataUrl}
            alt="Chart screenshot"
            className="h-32 w-full border border-[var(--color-surface-border)] object-cover"
          />
          <button
            type="button"
            onClick={() => onScreenshotChange(null)}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center bg-black/60 text-white transition-colors hover:bg-black/80"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 flex cursor-pointer items-center justify-center gap-2 border-2 border-dashed border-[var(--color-surface-border)] p-6 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent-light)]"
        >
          <ImagePlus className="h-5 w-5" />
          Drop chart screenshot or click to upload
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
