import { useSupportDrawer } from '../hooks/useSupportDrawer'
import { StarMotif } from './ui'

type Props = {
  hidden?: boolean
}

/** Desktop chat-style Support button (bottom right) — toggles the support panel. Mobile uses BottomBar. */
export function StickySupport({ hidden = false }: Props) {
  const { open, openDrawer, closeDrawer } = useSupportDrawer()
  if (hidden) return null

  return (
    <button
      type="button"
      onClick={open ? closeDrawer : openDrawer}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-label={open ? 'Close support form' : 'Support Exaltavit'}
      className={`group fixed right-6 bottom-20 z-[60] hidden items-center gap-3 rounded-full border-2 py-2 pr-6 pl-2 text-left shadow-[0_10px_30px_rgba(16,31,50,0.35)] ring-4 transition-colors duration-300 md:inline-flex ${
        open
          ? 'border-navy/20 bg-navy text-ivory ring-navy/10'
          : 'border-gold-soft bg-gold text-ivory ring-gold/20 hover:bg-[#b4874a]'
      }`}
    >
      <span
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          open ? 'bg-ivory/10' : 'bg-ivory text-gold'
        }`}
        aria-hidden="true"
      >
        {open ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <>
            <span className="absolute inset-0 animate-ping rounded-full bg-ivory/40 [animation-duration:2.4s] motion-reduce:hidden" />
            <StarMotif className="relative h-5 w-5" />
          </>
        )}
      </span>
      {open ? (
        <span className="text-base font-semibold tracking-wide">Close</span>
      ) : (
        <span>
          <span className="block text-base leading-tight font-semibold tracking-wide">Support Exaltavit</span>
          <span className="block text-xs text-ivory/85">Give a gift · keep it free</span>
        </span>
      )}
    </button>
  )
}
