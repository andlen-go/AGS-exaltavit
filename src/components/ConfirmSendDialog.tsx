import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export type ConfirmRow = [label: string, value: string]

/**
 * "Review before sending" dialog shared by the site forms.
 * Portaled to <body> because the cart and support panels use transforms, which would trap a fixed overlay inside them.
 */
export function ConfirmSendDialog({
  open,
  title,
  rows,
  note,
  confirmLabel = 'Yes, send it',
  sending,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  rows: ConfirmRow[]
  note?: ReactNode
  confirmLabel?: string
  sending: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const confirmRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef(onCancel)
  useEffect(() => {
    cancelRef.current = onCancel
  })

  useEffect(() => {
    if (open) confirmRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    // Capture phase + stopPropagation so Escape closes only this dialog, not the sheet/drawer underneath.
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      if (!sending) cancelRef.current()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, sending])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center" role="presentation">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Go back and edit"
        className="absolute inset-0 animate-overlay-in bg-navy/55 backdrop-blur-[2px]"
        onClick={() => !sending && onCancel()}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-send-title"
        className="relative z-10 w-full max-w-md animate-pop-in overflow-hidden rounded-t-xl bg-ivory shadow-2xl sm:rounded-xl"
      >
        <div className="bg-navy px-5 py-4 text-ivory sm:px-6">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-gold-soft uppercase">Please confirm</p>
          <h2 id="confirm-send-title" className="font-display text-2xl leading-tight">
            {title}
          </h2>
        </div>
        <div className="max-h-[55dvh] space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
          <dl className="divide-y divide-navy/10 rounded-lg border border-navy/10 bg-ivory-deep/40 px-4">
            {rows.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2.5 text-sm">
                <dt className="text-navy/55">{label}</dt>
                <dd className="font-medium break-words whitespace-pre-line text-navy">{value}</dd>
              </div>
            ))}
          </dl>
          {note ? <p className="text-sm leading-relaxed text-navy/70">{note}</p> : null}
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-navy/10 bg-ivory-deep/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={sending}
            className="rounded-sm border border-navy/25 px-5 py-2.5 text-sm font-semibold text-navy transition hover:border-navy/50 hover:bg-ivory disabled:opacity-50"
          >
            Go back and edit
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={sending}
            aria-busy={sending}
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold text-ivory transition hover:bg-gold-soft disabled:cursor-wait disabled:opacity-75"
          >
            {sending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory" aria-hidden="true" />
            ) : null}
            {sending ? 'Sending…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
