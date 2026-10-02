import type { ChangeEvent, ReactNode } from 'react'

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

export function SubmitButton({
  onClick,
  sending,
  label = 'Send',
  className = '',
}: {
  onClick: () => void
  sending: boolean
  label?: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={sending}
      aria-busy={sending}
      className={`inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold tracking-wide text-ivory transition hover:bg-gold-soft disabled:cursor-wait disabled:opacity-70 ${className}`}
    >
      {sending ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory"
          aria-hidden="true"
        />
      ) : null}
      {sending ? 'Sending…' : label}
    </button>
  )
}

/** Off-screen field that humans never see; bots that fill it are silently ignored by the server. */
export function HoneypotField(props: { value: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div aria-hidden="true" className="sr-only">
      <label>
        Company website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  )
}
