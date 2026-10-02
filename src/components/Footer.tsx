import { useState } from 'react'
import { eventConfig } from '../config/event'
import { ShareBar } from './ShareBar'
import { BrandLogo, Sheet } from './ui'

export function Footer() {
  const [dialog, setDialog] = useState<'privacy' | 'orders' | null>(null)

  return (
    <footer className="border-t border-navy/10 bg-navy px-4 py-14 text-ivory sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              <BrandLogo className="h-20 w-auto" />
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-gold-soft uppercase">{eventConfig.organizer}</p>
                <h2 className="mt-2 font-display text-4xl">{eventConfig.title}</h2>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/70">
              {eventConfig.dateLabel} · {eventConfig.venue}, {eventConfig.venueCity}. Free admission.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={eventConfig.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-ivory/25 px-4 py-2 text-sm font-semibold text-ivory hover:border-ivory/50"
              >
                Facebook
              </a>
              <a
                href={`mailto:${eventConfig.organizerEmail}`}
                className="rounded-sm border border-ivory/25 px-4 py-2 text-sm font-semibold text-ivory hover:border-ivory/50"
              >
                Contact
              </a>
            </div>
            <p className="mt-8 text-xs font-semibold tracking-[0.22em] text-gold-soft uppercase">Share this page</p>
            <ShareBar tone="dark" className="mt-3" />
          </div>

          <div className="space-y-4 text-sm text-ivory/70">
            <p className="font-semibold tracking-wide text-ivory">FAQ</p>
            <details className="border-b border-ivory/15 pb-3">
              <summary className="cursor-pointer text-ivory">Is the concert free?</summary>
              <p className="mt-2 leading-relaxed">
                Yes. Admission is free. Optional gifts and merch pre-orders support meals and production.
              </p>
            </details>
            <details className="border-b border-ivory/15 pb-3">
              <summary className="cursor-pointer text-ivory">How do donations work?</summary>
              <p className="mt-2 leading-relaxed">
                Transfer via GCash when details are posted, then email your amount and notes. The site does not process
                payments or verify transfers.
              </p>
            </details>
            <details className="border-b border-ivory/15 pb-3">
              <summary className="cursor-pointer text-ivory">Does RSVP reserve a seat?</summary>
              <p className="mt-2 leading-relaxed">
                No. RSVPs are for planning only. Walk-ins remain welcome while space allows.
              </p>
            </details>
            <div className="flex flex-wrap gap-4 pt-2">
              <button type="button" className="text-gold-soft hover:underline" onClick={() => setDialog('privacy')}>
                Privacy note
              </button>
              <button type="button" className="text-gold-soft hover:underline" onClick={() => setDialog('orders')}>
                Order note
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 text-xs text-ivory/45">
          <p>
            © {new Date().getFullYear()} {eventConfig.organizer}. Exaltavit concert page.
          </p>
          <a href="/admin" rel="nofollow" className="text-ivory/35 hover:text-ivory/70">
            Admin
          </a>
        </div>
      </div>

      <Sheet open={dialog === 'privacy'} title="Privacy note" onClose={() => setDialog(null)}>
        <p className="text-sm leading-relaxed text-navy/75">
          Information you submit through the forms on this page is emailed to {eventConfig.organizer} at{' '}
          {eventConfig.privacyContact}, with a copy sent to the email address you provide. The website does not keep a
          database of submissions. Ask the organizer to delete your message if you change your mind about recognition
          or contact use.
        </p>
      </Sheet>

      <Sheet open={dialog === 'orders'} title="Order note" onClose={() => setDialog(null)}>
        <p className="text-sm leading-relaxed text-navy/75">
          Merchandise checkout sends your order request to the organizer by email and a copy with your record ID to you.
          No payment is taken on this website — payment, inventory, and pickup are confirmed by {eventConfig.organizer}.
          Keep your record ID when corresponding about an order.
        </p>
      </Sheet>
    </footer>
  )
}
