import { useEffect, useRef } from 'react'
import { eventConfig } from '../config/event'
import { useSupportDrawer } from '../hooks/useSupportDrawer'
import { BrandLogo, Button } from './ui'

const links = [
  { href: '#voices', label: 'Voices' },
  { href: '#repertoire', label: 'Repertoire' },
  { href: '#merchandise', label: 'Keepsakes' },
  { href: '#attend', label: 'Attend' },
  { href: '#support', label: 'Support' },
  { href: '#share', label: 'Share' },
]

export function Header() {
  const { openDrawer } = useSupportDrawer()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const root = document.documentElement
    const observer = new ResizeObserver(() => root.style.setProperty('--header-h', `${el.offsetHeight}px`))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <header ref={ref} className="sticky top-0 z-40 border-b border-navy/10 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <BrandLogo className="h-10 w-auto sm:h-11" decorative />
          <span className="h-8 w-px bg-navy/15" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-semibold tracking-[0.2em] text-gold uppercase">
              {eventConfig.organizer}
            </span>
            <span className="block font-display text-xl leading-none text-navy sm:text-2xl">{eventConfig.title}</span>
          </span>
        </a>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link-underline pb-0.5 text-sm font-medium text-navy/70 hover:text-navy"
            >
              {link.label}
            </a>
          ))}
          <Button type="button" variant="gold" className="!py-2" onClick={openDrawer} aria-haspopup="dialog">
            Support
          </Button>
        </nav>
        <button
          type="button"
          onClick={openDrawer}
          aria-haspopup="dialog"
          className="rounded-sm bg-gold px-3 py-2 text-xs font-semibold tracking-wide text-ivory lg:hidden"
        >
          Support
        </button>
      </div>
    </header>
  )
}
