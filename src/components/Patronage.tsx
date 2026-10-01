import { useState } from 'react'
import {
  eventConfig,
  formatPhp,
  isGCashReady,
  isOrganizerEmailReady,
  isProgressReady,
} from '../config/event'
import { useSupportDrawer } from '../hooks/useSupportDrawer'
import { copyText, formatEmailPackage, makeRecordId, openMailto, type MailtoPayload } from '../lib/mailto'
import { MailtoActions } from './MediaPlaceholder'
import { Button, Collapse, Field, Input, LineIcon, Notice, Section, Select, Textarea, type IconName } from './ui'

const VALUE_ICONS: IconName[] = ['door', 'stage', 'cup']
const VALUE_TITLES = ['Free admission', 'Production essentials', 'Artist hospitality']
const OPPORTUNITY_ICONS: Record<string, IconName> = {
  hospitality: 'cup',
  print: 'print',
  production: 'stage',
  inkind: 'gift',
}

export function Patronage() {
  const gcashReady = isGCashReady()
  const progressReady = isProgressReady()
  const emailReady = isOrganizerEmailReady()
  const { openDrawer } = useSupportDrawer()

  const [partnerOpen, setPartnerOpen] = useState(false)

  const [partnerName, setPartnerName] = useState('')
  const [partnerContact, setPartnerContact] = useState('')
  const [kind, setKind] = useState<'cash' | 'in-kind'>('cash')
  const [category, setCategory] = useState(eventConfig.sponsorOpportunities[0]?.id ?? '')
  const [proposal, setProposal] = useState('')
  const [partnerRecognize, setPartnerRecognize] = useState(false)
  const [partnerStatus, setPartnerStatus] = useState<string | null>(null)
  const [partnerError, setPartnerError] = useState<string | null>(null)

  function buildPartnerPayload(): MailtoPayload | null {
    if (!partnerName.trim() || !partnerContact.trim() || !proposal.trim()) {
      setPartnerError('Name, contact, and a short proposal are required.')
      return null
    }
    const categoryLabel =
      eventConfig.sponsorOpportunities.find((item) => item.id === category)?.title ?? category
    const recordId = makeRecordId('SPONSOR')
    const subject = `[Exaltavit Partner] ${recordId} — ${categoryLabel}`
    const body = [
      'Exaltavit partnership inquiry',
      `Record ID: ${recordId}`,
      `Name / organization: ${partnerName.trim()}`,
      `Contact: ${partnerContact.trim()}`,
      `Support type: ${kind}`,
      `Category: ${categoryLabel}`,
      `Recognition permission: ${partnerRecognize ? 'yes' : 'no'}`,
      '',
      'Proposal:',
      proposal.trim(),
    ].join('\n')
    return { to: eventConfig.organizerEmail, subject, body }
  }

  async function openPartnerDraft() {
    setPartnerError(null)
    setPartnerStatus(null)
    const payload = buildPartnerPayload()
    if (!payload) return
    openMailto(payload)
    setPartnerStatus('Your email draft should open. Nothing is sent until you press send in your mail app.')
  }

  async function copyPartnerMessage() {
    setPartnerError(null)
    setPartnerStatus(null)
    const payload = buildPartnerPayload()
    if (!payload) return
    const ok = await copyText(formatEmailPackage(payload))
    setPartnerStatus(ok ? 'Message copied. Paste it into your email app when ready.' : 'Could not copy — try Open email draft.')
  }

  return (
    <Section
      id="support"
      eyebrow="Patronage"
      title="Support the experience"
      lead={eventConfig.patronageLead}
      className="bg-ivory-deep/25"
    >
      <ul className="grid gap-5 md:grid-cols-3">
        {eventConfig.patronageValuePoints.map((point, index) => (
          <li
            key={point}
            className="group relative overflow-hidden rounded-md border border-navy/10 bg-ivory p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" aria-hidden="true" />
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-gold-soft">
              <LineIcon name={VALUE_ICONS[index % VALUE_ICONS.length]!} />
            </span>
            <p className="mt-4 font-display text-2xl leading-tight text-navy">{VALUE_TITLES[index] ?? 'Your support'}</p>
            <p className="mt-2 text-sm leading-relaxed text-navy/70">{point}</p>
          </li>
        ))}
      </ul>

      <div className="relative mt-10 overflow-hidden rounded-md bg-navy text-ivory shadow-lg">
        {eventConfig.media.hero.src ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url('${eventConfig.media.hero.src}')` }}
            aria-hidden="true"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/60" aria-hidden="true" />
        <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-gold-soft uppercase">Give a gift</p>
            <p className="mt-2 font-display text-3xl leading-tight sm:text-4xl">Every gift keeps the doors open</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/75">{eventConfig.surplusCopy}</p>

            {progressReady ? (
              <div className="mt-6 max-w-md">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-display text-2xl">{formatPhp(eventConfig.budget.raisedPhp!)}</span>
                  <span className="text-ivory/60">of {formatPhp(eventConfig.budget.goalPhp!)}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-ivory/15">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{
                      width: `${Math.min(100, (eventConfig.budget.raisedPhp! / eventConfig.budget.goalPhp!) * 100)}%`,
                    }}
                  />
                </div>
                {eventConfig.budget.updatedAt ? (
                  <p className="mt-1 text-xs text-ivory/50">Updated {eventConfig.budget.updatedAt}</p>
                ) : null}
              </div>
            ) : null}

            {emailReady ? (
              <Button type="button" variant="gold" className="mt-6" onClick={openDrawer}>
                Send a gift note
              </Button>
            ) : (
              <p className="mt-6 text-sm text-ivory/75">
                Contact the organizer via{' '}
                <a href={eventConfig.facebookUrl} className="font-medium text-gold-soft hover:underline" target="_blank" rel="noreferrer">
                  Facebook
                </a>{' '}
                to support the concert.
              </p>
            )}
          </div>

          <aside className="rounded-md border border-ivory/15 bg-ivory/5 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-soft uppercase">GCash</p>
            {gcashReady ? (
              <div className="mt-3 space-y-3">
                <p className="font-display text-2xl text-ivory">{eventConfig.gcash.accountName}</p>
                <p className="text-lg tracking-wide text-ivory/90">{eventConfig.gcash.accountNumber}</p>
                <button
                  type="button"
                  className="text-sm font-semibold text-gold-soft underline-offset-4 hover:underline"
                  onClick={() => copyText(eventConfig.gcash.accountNumber)}
                >
                  Copy number
                </button>
                <img
                  src={eventConfig.gcash.qrImagePath}
                  alt="GCash QR code for Exaltavit gifts"
                  className="w-full max-w-[180px] rounded bg-ivory p-3"
                />
              </div>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-ivory/75">
                Transfer details will appear here when the organizer publishes GCash name, number, and QR. Until then,
                use the gift note to reach the inbox.
              </p>
            )}
          </aside>
        </div>
      </div>

      <div className="mt-14">
        <h3 className="font-display text-3xl text-navy">Partnerships</h3>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-navy/70">
          Partners who underwrite production, print, or hospitality help keep admission free and the evening
          polished. Share a short proposal — the organizer will reply from their inbox.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {eventConfig.sponsorOpportunities.map((item) => (
            <li
              key={item.id}
              className="rounded-md border border-navy/10 bg-ivory p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-gold/35 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
                <LineIcon name={OPPORTUNITY_ICONS[item.id] ?? 'gift'} />
              </span>
              <p className="mt-3 font-display text-xl text-navy">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-navy/65">{item.summary}</p>
            </li>
          ))}
        </ul>

        {emailReady ? (
          <>
            <Button
              type="button"
              variant={partnerOpen ? 'secondary' : 'primary'}
              className="mt-6"
              aria-expanded={partnerOpen}
              onClick={() => setPartnerOpen((value) => !value)}
            >
              {partnerOpen ? 'Hide partnership form' : 'Inquire about partnership'}
            </Button>
            <Collapse open={partnerOpen}>
            <div className="mt-6 max-w-xl space-y-4">
              <Field label="Name or organization">
                <Input value={partnerName} onChange={(event) => setPartnerName(event.target.value)} />
              </Field>
              <Field label="Contact">
                <Input value={partnerContact} onChange={(event) => setPartnerContact(event.target.value)} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Support type">
                  <Select value={kind} onChange={(event) => setKind(event.target.value as 'cash' | 'in-kind')}>
                    <option value="cash">Cash</option>
                    <option value="in-kind">In-kind</option>
                  </Select>
                </Field>
                <Field label="Category">
                  <Select value={category} onChange={(event) => setCategory(event.target.value)}>
                    {eventConfig.sponsorOpportunities.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Field label="Proposal">
                <Textarea value={proposal} onChange={(event) => setProposal(event.target.value)} />
              </Field>
              <label className="flex items-start gap-3 text-sm text-navy/80">
                <input
                  type="checkbox"
                  checked={partnerRecognize}
                  onChange={(event) => setPartnerRecognize(event.target.checked)}
                  className="mt-1"
                />
                <span>You may recognize our support publicly if the partnership proceeds.</span>
              </label>
              {partnerError ? <Notice tone="warn">{partnerError}</Notice> : null}
              {partnerStatus ? <Notice tone="success">{partnerStatus}</Notice> : null}
              <MailtoActions onOpenDraft={openPartnerDraft} onCopyMessage={copyPartnerMessage} />
            </div>
            </Collapse>
          </>
        ) : null}
      </div>
    </Section>
  )
}
