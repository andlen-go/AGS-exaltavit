import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

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
    <section id={id} className={`scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-5xl">
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

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold'
}) {
  const styles = {
    primary: 'bg-navy text-ivory hover:bg-navy-soft',
    secondary: 'border border-navy/25 bg-transparent text-navy hover:border-navy/50 hover:bg-ivory-deep/60',
    ghost: 'bg-transparent text-navy hover:bg-navy/5',
    gold: 'bg-gold text-ivory hover:bg-gold-soft',
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
  'w-full rounded-sm border border-navy/20 bg-ivory px-3 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-gold focus:outline-none'

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

  return <div className={`rounded-sm border px-4 py-3 text-sm leading-relaxed ${toneClass}`}>{children}</div>
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
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-navy/45" aria-label="Close dialog" onClick={onClose} />
      <div className="relative z-10 max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-md bg-ivory p-5 shadow-2xl sm:rounded-md sm:p-6">
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
