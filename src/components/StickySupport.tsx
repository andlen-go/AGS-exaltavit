type Props = {
  hidden?: boolean
}

/** Persistent desktop sticky Support chip — scrolls to #support. Mobile uses BottomBar. */
export function StickySupport({ hidden = false }: Props) {
  if (hidden) return null

  return (
    <a
      href="#support"
      className="fixed top-1/2 left-0 z-30 hidden -translate-y-1/2 md:block"
      aria-label="Support Exaltavit"
    >
      <span className="inline-flex items-center gap-2 border border-gold/50 bg-gold px-3 py-4 text-[11px] font-semibold tracking-[0.2em] text-ivory uppercase shadow-lg [writing-mode:vertical-rl] rotate-180 hover:bg-gold-soft">
        Support Exaltavit
      </span>
    </a>
  )
}
