import type { ReactNode } from 'react'

/** Labeled media placeholder until organizer supplies a photo */
export function MediaPlaceholder({
  label,
  className = '',
  children,
}: {
  label: string
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy via-navy-soft to-navy/90 ${className}`}
      role="img"
      aria-label={label}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgb(196 154 92 / 0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgb(247 242 233 / 0.12), transparent 40%)',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-sm px-6 text-center">
        {children ?? (
          <>
            <p className="font-display text-2xl text-ivory/90 sm:text-3xl">Photo coming soon</p>
            <p className="mt-2 text-xs leading-relaxed tracking-wide text-gold-soft/90 uppercase">{label}</p>
          </>
        )}
      </div>
    </div>
  )
}

export function MailtoActions({
  onOpenDraft,
  onCopyMessage,
  openLabel = 'Open email draft',
  copyLabel = 'Copy message',
  className = '',
}: {
  onOpenDraft: () => void
  onCopyMessage: () => void
  openLabel?: string
  copyLabel?: string
  className?: string
}) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <button
        type="button"
        onClick={onOpenDraft}
        className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold tracking-wide text-ivory transition hover:bg-gold-soft"
      >
        {openLabel}
      </button>
      <button
        type="button"
        onClick={onCopyMessage}
        className="inline-flex items-center justify-center gap-2 rounded-sm border border-navy/25 bg-transparent px-5 py-2.5 text-sm font-semibold tracking-wide text-navy transition hover:border-navy/50 hover:bg-ivory-deep/60"
      >
        {copyLabel}
      </button>
    </div>
  )
}
