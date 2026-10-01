type Props = {
  hidden?: boolean
}

/** Persistent desktop sticky Support chip — scrolls to #support. Mobile uses BottomBar. */
export function StickySupport({ hidden = false }: Props) {
  if (hidden) return null

  return (
    <a
      href="#support"
      className="fixed top-1/2 left-0 z-30 hidden -translate-y-1/2 md:flex"
      aria-label="Support Exaltavit"
    >
      <span className="flex origin-left -rotate-180 items-center gap-2 border border-gold/40 bg-gold px-2.5 py-3 text-xs font-semibold tracking-[0.18em] text-ivory uppercase shadow-md [writing-mode:vertical-rl] hover:bg-gold-soft">
        Support Exaltavit
      </span>
    </a>
  )
}
