import { useEffect, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className = '',
}: {
  id?: string
  eyebrow?: string
  title: string
  lead?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`relative scroll-mt-32 px-4 py-16 sm:px-6 lg:px-8 ${className}`}>
      <SectionDivider />
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-10 max-w-2xl">
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-gold uppercase">{eyebrow}</p>
          ) : null}
          <h2 className="font-display text-4xl leading-tight text-navy sm:text-5xl">{title}</h2>
          {lead ? <p className="mt-4 text-base leading-relaxed text-navy/75 sm:text-lg">{lead}</p> : null}
          <div className="ornament-line mt-6 h-px w-24 origin-left bg-gold/70" />
        </header>
        {children}
      </div>
    </section>
  )
}

/** Hairline + star ornament straddling the top edge of a section. */
function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-10 flex -translate-y-1/2 items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/45 to-gold/45" />
      <span className="mx-3 flex h-7 w-7 items-center justify-center rounded-full border border-gold/45 bg-ivory text-gold shadow-sm">
        <StarMotif className="h-3.5 w-3.5" />
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/45 to-gold/45" />
    </div>
  )
}

function initials(name: string): string {
  const words = name
    .replace(/^the\s+/i, '')
    .split(/\s+/)
    .filter((word) => /^[A-Za-z]/.test(word))
  return words
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join('')
}

/** Sponsor logo, or an initials monogram when no logo is configured. */
export function SponsorBadge({
  name,
  logoSrc,
  className = 'h-12 w-12',
}: {
  name: string
  logoSrc?: string
  className?: string
}) {
  if (logoSrc) {
    return <img src={logoSrc} alt={`${name} logo`} className={`${className} shrink-0 rounded-lg object-contain`} />
  }
  return (
    <span
      aria-hidden="true"
      className={`${className} flex shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold/10 font-display text-lg font-semibold text-gold`}
    >
      {initials(name) || '♥'}
    </span>
  )
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'onDark'
}) {
  const styles = {
    primary: 'bg-navy text-ivory hover:bg-navy-soft',
    secondary: 'border border-navy/25 bg-transparent text-navy hover:border-navy/50 hover:bg-ivory-deep/60',
    ghost: 'bg-transparent text-navy hover:bg-navy/5',
    gold: 'bg-gold text-ivory hover:bg-gold-soft',
    onDark: 'border border-ivory/40 bg-transparent text-ivory hover:border-ivory/70 hover:bg-ivory/10',
  }[variant]

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-45 ${styles} ${className}`}
      {...props}
    />
  )
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-navy">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-navy/55">{hint}</span> : null}
    </label>
  )
}

const controlClass =
  'w-full rounded-sm border border-navy/20 bg-ivory px-3 py-2.5 text-sm text-navy placeholder:text-navy/40 transition duration-200 hover:border-navy/35 focus:border-gold focus:ring-4 focus:ring-gold/15 focus:outline-none'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={controlClass} {...props} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${controlClass} min-h-28 resize-y`} {...props} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={controlClass} {...props} />
}

export function Notice({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'success' | 'warn'
  children: ReactNode
}) {
  const toneClass = {
    neutral: 'border-navy/15 bg-ivory-deep/50 text-navy/80',
    success: 'border-gold/40 bg-gold/10 text-navy',
    warn: 'border-navy/20 bg-navy/5 text-navy/75',
  }[tone]

  return (
    <div className={`animate-notice-in rounded-sm border px-4 py-3 text-sm leading-relaxed ${toneClass}`} role="status">
      {children}
    </div>
  )
}

/** Smooth height reveal (grid-rows 0fr → 1fr) so toggled content doesn't make the page jump. */
export function Collapse({
  open,
  children,
  as: Tag = 'div',
  className = '',
}: {
  open: boolean
  children: ReactNode
  as?: 'div' | 'li'
  className?: string
}) {
  return (
    <Tag
      aria-hidden={!open}
      inert={!open}
      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-elegant)] motion-reduce:transition-none ${
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      } ${className}`}
    >
      {/* Padding/negative margin leaves room for focus rings inside the clipped area. */}
      <div className="-m-1.5 min-h-0 overflow-hidden p-1.5">{children}</div>
    </Tag>
  )
}

export function Sheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <button
        className="absolute inset-0 animate-overlay-in bg-navy/45 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[88dvh] animate-pop-in w-full max-w-lg overflow-y-auto rounded-t-md bg-ivory p-5 shadow-2xl sm:rounded-md sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl text-navy">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm px-2 py-1 text-sm text-navy/60 hover:bg-navy/5 hover:text-navy"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export type IconName = 'door' | 'stage' | 'cup' | 'print' | 'gift' | 'walk' | 'heart' | 'pin' | 'clock' | 'users'

const ICON_PATHS: Record<IconName, string> = {
  door: 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M3 21h18M14 12h.01',
  stage: 'M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3ZM19 11a7 7 0 0 1-14 0M12 18v3M8 21h8',
  cup: 'M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6V8ZM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 2v3M12 2v3',
  print: 'M7 8V3h10v5M6 17H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2M7 13h10v8H7z',
  gift: 'M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7ZM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z',
  walk: 'M13 4a1.5 1.5 0 1 0 0-.01M10 21l2-6 3 3v3M9 12l2-4 4 2 2 3M11 8l-3 1-1 4',
  heart: 'M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1Z',
  pin: 'M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12ZM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
}

export function LineIcon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

/** Avant Garde Singers mark (transparent PNG generated by docker/tools/make-logo.py). */
export function BrandLogo({ className = 'h-10 w-auto', decorative = false }: { className?: string; decorative?: boolean }) {
  return (
    <img
      src="/brand/ags-logo-480.png"
      alt={decorative ? '' : 'Avant Garde Singers logo'}
      aria-hidden={decorative || undefined}
      width={195}
      height={480}
      className={`shrink-0 object-contain ${className}`}
    />
  )
}

export function StarMotif({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 1.8 13.4 10.6 22.2 12 13.4 13.4 12 22.2 10.6 13.4 1.8 12 10.6 10.6 12 1.8Z"
      />
    </svg>
  )
}
