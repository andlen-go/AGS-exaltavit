import { useEffect, useRef, useState, type ReactNode } from 'react'
import { eventConfig, getShareText, getShareUrl } from '../config/event'
import { copyText } from '../lib/mailto'

type Network = {
  id: string
  label: string
  color: string
  href: (url: string, text: string) => string
  icon: ReactNode
  /** App deep link — only shown on small screens where the app is likely installed */
  mobileOnly?: boolean
  /** Hidden on phones when the native share sheet is available, to keep the row compact */
  coveredByNativeShare?: boolean
}

const enc = encodeURIComponent

const NETWORKS: Network[] = [
  {
    id: 'facebook',
    label: 'Facebook',
    color: '#1877F2',
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    icon: (
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    ),
  },
  {
    id: 'messenger',
    label: 'Messenger',
    color: '#0084FF',
    href: (url) => `fb-messenger://share/?link=${enc(url)}`,
    mobileOnly: true,
    icon: (
      <path d="M12 0C5.24 0 0 4.95 0 11.64c0 3.5 1.43 6.52 3.77 8.61.2.18.31.42.32.68l.06 2.13a.96.96 0 0 0 1.35.85l2.38-1.05a.96.96 0 0 1 .64-.05c1.09.3 2.26.46 3.48.46 6.76 0 12-4.95 12-11.63C24 4.95 18.76 0 12 0Zm7.2 8.95-3.52 5.59a1.8 1.8 0 0 1-2.6.48l-2.8-2.1a.72.72 0 0 0-.87 0l-3.78 2.87c-.5.38-1.16-.22-.83-.76l3.53-5.59a1.8 1.8 0 0 1 2.6-.48l2.8 2.1c.26.2.61.2.87 0l3.78-2.87c.5-.38 1.16.22.82.76Z" />
    ),
  },
  {
    id: 'x',
    label: 'X',
    color: '#000000',
    href: (url, text) => `https://x.com/intent/post?text=${enc(text)}&url=${enc(url)}`,
    icon: (
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: '#25D366',
    href: (url, text) => `https://wa.me/?text=${enc(`${text} ${url}`)}`,
    icon: (
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    ),
  },
  {
    id: 'viber',
    label: 'Viber',
    color: '#7360F2',
    href: (url, text) => `viber://forward?text=${enc(`${text} ${url}`)}`,
    mobileOnly: true,
    icon: (
      <path d="M12 1.5C6.2 1.5 2.25 4.7 2.25 10.4c0 3.1 1.1 5.4 3.05 6.8v4.3c0 .5.6.8 1 .4l3-2.9c.9.15 1.8.2 2.7.2 5.8 0 9.75-3.2 9.75-8.8S17.8 1.5 12 1.5Zm4.6 13.1c-.3.6-1.2 1.2-1.9 1.1-1.1-.2-3.4-1.3-5.2-3.2-1.6-1.6-2.6-3.6-2.8-4.6-.1-.7.4-1.5 1-1.8.3-.15.7-.1.9.2l1 1.4c.2.3.2.7-.05 1l-.5.5c.4 1 1.6 2.3 2.7 2.8l.5-.5c.3-.3.7-.3 1-.1l1.4 1c.3.2.4.6.25.9ZM12.6 5.2c2.6.2 4.6 2.3 4.7 4.9 0 .3-.2.5-.5.5s-.5-.2-.5-.5c-.1-2.1-1.7-3.8-3.8-3.9-.3 0-.5-.3-.5-.5 0-.3.3-.5.6-.5Zm.1 1.9c1.5.1 2.7 1.3 2.8 2.8 0 .3-.2.5-.5.5s-.5-.2-.5-.5c-.1-1-.9-1.8-1.9-1.8-.3 0-.5-.3-.5-.5 0-.3.3-.5.6-.5Z" />
    ),
  },
  {
    id: 'telegram',
    label: 'Telegram',
    color: '#26A5E4',
    href: (url, text) => `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`,
    coveredByNativeShare: true,
    icon: (
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    color: '#0A66C2',
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    coveredByNativeShare: true,
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  {
    id: 'email',
    label: 'Email',
    color: '#A5783E',
    coveredByNativeShare: true,
    href: (url, text) => `mailto:?subject=${enc(`${eventConfig.title} — ${eventConfig.dateLabel}`)}&body=${enc(`${text}\n\n${url}`)}`,
    icon: (
      <path d="M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v.5l10 6.25L22 6.5V6H2Zm20 2.85-9.47 5.92a1 1 0 0 1-1.06 0L2 8.85V18h20V8.85Z" />
    ),
  },
]

type Props = {
  tone?: 'light' | 'dark'
  className?: string
}

/** Prominent "spread the word" band placed under the hero. */
export function ShareBand() {
  const ref = useRef<HTMLElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    function onScroll() {
      const el = ref.current
      if (!el) return
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0
      setStuck(el.getBoundingClientRect().top <= headerHeight + 0.5)
    }
    const frame = requestAnimationFrame(onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section
      ref={ref}
      id="share"
      aria-label="Share this page"
      className={`sticky top-[var(--header-h,4rem)] z-30 scroll-mt-24 border-y border-gold/25 px-4 backdrop-blur-md transition-[padding,background-color] duration-200 sm:px-6 lg:px-8 ${
        stuck ? 'bg-ivory/95 py-2 shadow-sm' : 'bg-ivory-deep/60 py-6'
      }`}
    >
      <div className="mx-auto flex max-w-[1180px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {stuck ? (
          <p className="hidden text-xs font-semibold tracking-[0.22em] text-gold uppercase sm:block">Share Exaltavit</p>
        ) : (
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">Spread the word</p>
            <p className="mt-1 font-display text-2xl leading-tight text-navy sm:text-3xl">
              Invite family and friends to Exaltavit
            </p>
          </div>
        )}
        <ShareBar />
      </div>
    </section>
  )
}

/** One-click share buttons for major networks, native share sheet, and copy link. */
export function ShareBar({ tone = 'light', className = '' }: Props) {
  const [copied, setCopied] = useState(false)
  const url = getShareUrl()
  const text = getShareText()
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  async function copyLink() {
    const ok = await copyText(url)
    if (!ok) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2500)
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: eventConfig.title, text, url })
    } catch {
      // dismissed
    }
  }

  const ring = tone === 'dark' ? 'ring-ivory/20 hover:ring-ivory/60' : 'ring-navy/10 hover:ring-navy/30'
  const iconButton = `flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm ring-1 transition hover:-translate-y-0.5 sm:h-9 sm:w-9 ${ring}`

  return (
    <div className={`flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2 ${className}`}>
      {canNativeShare ? (
        <button
          type="button"
          onClick={nativeShare}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-gold px-3 text-sm font-semibold text-ivory shadow-sm hover:bg-gold-soft sm:h-9 sm:px-3.5"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Share
        </button>
      ) : null}
      {NETWORKS.map((network) => (
        <a
          key={network.id}
          href={network.href(url, text)}
          target={network.id === 'email' ? undefined : '_blank'}
          rel="noreferrer"
          aria-label={`Share on ${network.label}`}
          title={`Share on ${network.label}`}
          className={`${iconButton} ${network.mobileOnly ? 'md:hidden' : ''} ${
            canNativeShare && network.coveredByNativeShare ? 'max-sm:hidden' : ''
          }`}
          style={{ backgroundColor: network.color }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            {network.icon}
          </svg>
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? 'Link copied' : 'Copy link'}
        title={copied ? 'Link copied' : 'Copy link'}
        className={`${iconButton} ${copied ? 'bg-gold' : 'bg-navy-soft'}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          {copied ? (
            <path d="M5 12.5 10 17l9-10" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M10 14a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1M14 10a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1" strokeLinecap="round" />
          )}
        </svg>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied' : ''}
      </span>
    </div>
  )
}
