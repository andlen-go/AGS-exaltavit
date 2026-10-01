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
      className="fixed right-6 bottom-6 z-[60] hidden items-center gap-2 rounded-full border border-gold/50 bg-gold py-3 pr-5 pl-4 text-sm font-semibold tracking-wide text-ivory shadow-xl transition hover:bg-gold-soft md:inline-flex"
    >
      {open ? (
        <>
          <span aria-hidden="true" className="text-lg leading-none">
            ×
          </span>
          Close
        </>
      ) : (
        <>
          <StarMotif className="h-4 w-4" />
          Support Exaltavit
        </>
      )}
    </button>
  )
}
