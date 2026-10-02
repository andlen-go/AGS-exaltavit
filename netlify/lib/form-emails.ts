import { randomBytes } from 'node:crypto'
import { eventConfig, formatPhp, getOrderableProducts, getTimeDisplay } from '../../src/config/event'
import {
  isValidEmail,
  isValidMobile,
  MAX_PHOTO_BYTES,
  type FormDataMap,
  type FormType,
  type GiftData,
  type MerchData,
  type PartnerData,
  type RsvpData,
} from '../../src/shared/forms'
import type { EmailContent, ItemRow, Row } from './email-templates'

export type Attachment = { filename: string; content: Buffer; contentType: string }

export type PreparedSubmission = {
  recordId: string
  submitterName: string
  submitterEmail: string | null
  organizer: EmailContent
  visitor: EmailContent
  attachments: Attachment[]
}

export class ValidationError extends Error {}

function fail(message: string): never {
  throw new ValidationError(message)
}

function text(value: unknown, max = 500): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function makeRecordId(prefix: string): string {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
  return `${prefix}-${stamp}-${randomBytes(2).toString('hex').toUpperCase()}`
}

function contact(data: { name?: unknown; email?: unknown; mobile?: unknown }, emailRequired: boolean) {
  const name = text(data.name, 120)
  const email = text(data.email, 200)
  const mobile = text(data.mobile, 30)
  if (emailRequired && !email) fail('Please enter your email address.')
  if (email && !isValidEmail(email)) fail('Please enter a valid email address.')
  if (!isValidMobile(mobile)) fail('Mobile number should look like 09XXXXXXXXX or +639XXXXXXXXX.')
  return { name, email, mobile }
}

function contactRows(name: string, email: string, mobile: string): Row[] {
  return [
    ['Name', name || '(not provided)'],
    ['Email', email || '(not provided)'],
    ['Mobile', mobile || '(not provided)'],
  ]
}

function greeting(name: string): string {
  return name ? `Hi ${name},` : 'Hello,'
}

function prepareMerch(raw: MerchData): PreparedSubmission {
  const { name, email, mobile } = contact(raw, true)
  if (!name) fail('Please enter your name.')
  if (!raw.policyAck) fail('Please acknowledge the pre-order policy before sending.')
  if (!Array.isArray(raw.lines) || raw.lines.length === 0) fail('Add at least one item to your cart.')
  if (raw.lines.length > 50) fail('Too many cart lines.')

  const products = getOrderableProducts()
  const items: ItemRow[] = []
  let subtotal = 0
  let count = 0
  for (const line of raw.lines) {
    const product = products.find((item) => item.id === line?.productId)
    const variant = product?.variants.find((item) => item.id === line?.variantId)
    const quantity = Number(line?.quantity)
    if (!product || !variant) fail('One of the items in your cart is no longer available. Please remove it and try again.')
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) fail('Item quantities must be between 1 and 99.')
    const amount = product.pricePhp * quantity
    subtotal += amount
    count += quantity
    items.push({ name: product.name, variant: variant.label, quantity, amount: formatPhp(amount) })
  }
  const addon = Math.max(0, Math.floor(Number(raw.donationAddonPhp) || 0))
  if (addon > 1_000_000) fail('Donation add-on is too large.')
  const total = subtotal + addon
  const recordId = makeRecordId('MERCH')
  const itemsBlock = {
    rows: items,
    totals: [
      ['Merchandise subtotal', formatPhp(subtotal)],
      ['Optional donation add-on', formatPhp(addon)],
    ] as Row[],
    grandTotal: ['Order total', formatPhp(total)] as Row,
  }
  const orderInfo: Row[] = [
    ['Pickup', eventConfig.pickupCopy],
    ['Order deadline', eventConfig.orderDeadlineCopy],
    ['Size chart ready', eventConfig.sizeChartReady ? 'Yes' : 'Not yet — confirm sizes with the organizer if unsure'],
  ]

  return {
    recordId,
    submitterName: name,
    submitterEmail: email,
    attachments: [],
    organizer: {
      subject: `[Exaltavit Keepsakes] ${recordId} — ${name} — ${formatPhp(total)}`,
      preheader: `${count} item${count === 1 ? '' : 's'} · ${formatPhp(total)} from ${name}`,
      eyebrow: 'Keepsakes · New pre-order',
      title: 'New keepsake pre-order',
      intro: [
        `${name} sent a keepsake pre-order request (${count} item${count === 1 ? '' : 's'}, ${formatPhp(total)}). Reply to this email to confirm payment and pickup.`,
      ],
      recordId,
      items: itemsBlock,
      sections: [
        { heading: 'Customer', rows: contactRows(name, email, mobile) },
        { heading: 'Order details', rows: [...orderInfo, ['Policy acknowledged', 'Yes']] },
      ],
    },
    visitor: {
      subject: `Your Exaltavit keepsake pre-order — ${recordId}`,
      preheader: `We received your pre-order for ${formatPhp(total)}. Here is your summary.`,
      eyebrow: 'Keepsakes · Pre-order received',
      title: 'Thank you for your pre-order',
      intro: [
        greeting(name),
        `We received your keepsake pre-order request. ${eventConfig.organizer} will reply to confirm payment and pickup — nothing has been charged yet.`,
        'Keep this email and your record ID for reference.',
      ],
      recordId,
      items: itemsBlock,
      sections: [
        { heading: 'Your details', rows: contactRows(name, email, mobile) },
        { heading: 'What happens next', rows: orderInfo },
      ],
      note: 'This is a pre-order request. Payment and pickup are confirmed by the organizer — not processed on the website.',
    },
  }
}

function prepareRsvp(raw: RsvpData): PreparedSubmission {
  const { name, email, mobile } = contact(raw, true)
  if (!name) fail('Please enter your name.')
  const partySize = Number(raw.partySize)
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > 20) fail('Party size should be between 1 and 20.')
  const invitedBy = text(raw.invitedBy, 120)
  const assistance = text(raw.assistance, 1000)
  const recordId = makeRecordId('RSVP')
  const rows: Row[] = [
    ...contactRows(name, email, mobile),
    ['Party size', String(partySize)],
    ['Invited by', invitedBy || '(not provided)'],
    ['Assistance notes', assistance || '(none)'],
  ]
  return {
    recordId,
    submitterName: name,
    submitterEmail: email,
    attachments: [],
    organizer: {
      subject: `[Exaltavit RSVP] ${recordId} — ${name}, party of ${partySize}`,
      preheader: `${name} is coming with a party of ${partySize}.`,
      eyebrow: 'Attendance · New RSVP',
      title: `Party of ${partySize} is coming`,
      intro: [`${name} let us know they’re coming. RSVPs are for planning only — not reserved seats.`],
      recordId,
      sections: [{ heading: 'RSVP details', rows }],
    },
    visitor: {
      subject: `See you at Exaltavit — ${eventConfig.dateLabel}`,
      preheader: `Thanks for letting us know you’re coming. ${eventConfig.dateLabel}, ${getTimeDisplay()}.`,
      eyebrow: 'Attendance · RSVP received',
      title: 'We’ll see you there',
      intro: [
        greeting(name),
        `Thank you for letting us know you’re coming. Your note helps ${eventConfig.organizer} plan seating and hospitality.`,
        'Admission is free and walk-ins remain welcome — this RSVP is for planning only and does not reserve seats.',
      ],
      recordId,
      sections: [{ heading: 'Your RSVP', rows }],
    },
  }
}

function preparePartner(raw: PartnerData): PreparedSubmission {
  const { name, email, mobile } = contact(raw, true)
  const proposal = text(raw.proposal, 4000)
  if (!name || !proposal) fail('Name, email, and a short proposal are required.')
  const kind = raw.kind === 'in-kind' ? 'In-kind' : 'Cash'
  const category =
    eventConfig.sponsorOpportunities.find((item) => item.id === raw.category)?.title ?? (text(raw.category, 80) || 'General')
  const recordId = makeRecordId('SPONSOR')
  const rows: Row[] = [
    ['Name / organization', name],
    ['Email', email],
    ['Mobile', mobile || '(not provided)'],
    ['Support type', kind],
    ['Category', category],
    ['Recognition permission', raw.recognize ? 'Yes' : 'No'],
  ]
  return {
    recordId,
    submitterName: name,
    submitterEmail: email,
    attachments: [],
    organizer: {
      subject: `[Exaltavit Partner] ${recordId} — ${name} — ${category}`,
      preheader: `${kind} partnership inquiry from ${name}: ${category}.`,
      eyebrow: 'Patronage · Partnership inquiry',
      title: 'New partnership inquiry',
      intro: [`${name} is interested in partnering with ${eventConfig.title}. Reply to this email to follow up.`],
      recordId,
      sections: [{ heading: 'Partner details', rows }],
      longText: { heading: 'Proposal', body: proposal },
    },
    visitor: {
      subject: `Thank you for your partnership inquiry — ${eventConfig.title}`,
      preheader: `We received your ${category.toLowerCase()} inquiry and will be in touch.`,
      eyebrow: 'Patronage · Inquiry received',
      title: 'Thank you for your support',
      intro: [
        greeting(name),
        `Thank you for offering to partner with ${eventConfig.title}. ${eventConfig.organizer} will review your proposal and reply personally.`,
        'A copy of what you sent is below for your records.',
      ],
      recordId,
      sections: [{ heading: 'Your inquiry', rows }],
      longText: { heading: 'Your proposal', body: proposal },
    },
  }
}

function prepareGift(raw: GiftData): PreparedSubmission {
  const { name, email, mobile } = contact(raw, false)
  const amount = Math.floor(Number(raw.amountPhp))
  if (!Number.isFinite(amount) || amount < 1) fail('Enter a gift amount of at least ₱1.')
  if (amount > 10_000_000) fail('Gift amount is too large.')
  const message = text(raw.message, 2000)
  const recognize = Boolean(raw.recognize)
  const attachments: Attachment[] = []
  let photoLabel = text(raw.photoLink, 500) || '(none)'
  if (recognize && raw.photo) {
    const { filename, contentType, base64 } = raw.photo
    if (!/^image\/(png|jpe?g|gif|webp|svg\+xml)$/.test(contentType ?? '')) fail('Photo or logo must be an image file.')
    const content = Buffer.from(String(base64 ?? ''), 'base64')
    if (content.length === 0) fail('The attached photo could not be read.')
    if (content.length > MAX_PHOTO_BYTES) fail('Photo or logo must be 4 MB or smaller.')
    const safeName = text(filename, 120).replace(/[^\w.\- ]/g, '_') || 'photo'
    attachments.push({ filename: safeName, content, contentType })
    photoLabel = `${safeName} (attached)`
  }
  const recordId = makeRecordId('GIFT')
  const giftRows: Row[] = [
    ['Amount', formatPhp(amount)],
    ...contactRows(name, email, mobile),
    ['Public recognition', recognize ? 'Yes' : 'No'],
  ]
  const recognitionRows: Row[] = recognize
    ? [
        ['Display as', raw.displayAs === 'organization' ? 'Organization' : 'Individual'],
        ['Display name', text(raw.displayName, 120) || name || '(use name above)'],
        ['Short description', text(raw.blurb, 500) || '(none)'],
        ['Website / social', text(raw.link, 300) || '(none)'],
        ['Photo / logo', photoLabel],
      ]
    : []
  const sections = [{ heading: 'Gift details', rows: giftRows }]
  if (recognitionRows.length) sections.push({ heading: 'Acknowledgments listing', rows: recognitionRows })
  const longText = message ? { heading: 'Message', body: message } : undefined
  const who = name || 'An anonymous supporter'
  return {
    recordId,
    submitterName: name,
    submitterEmail: email || null,
    attachments,
    organizer: {
      subject: `[Exaltavit Gift] ${recordId} — ${formatPhp(amount)}${name ? ` — ${name}` : ''}`,
      preheader: `${who} pledged a ${formatPhp(amount)} gift.`,
      eyebrow: 'Patronage · New gift',
      title: `${formatPhp(amount)} gift pledged`,
      intro: [
        `${who} pledged a gift to support ${eventConfig.title}. Please match it against incoming transfers — the site does not verify payments.`,
      ],
      recordId,
      sections,
      longText,
    },
    visitor: {
      subject: `Thank you for supporting ${eventConfig.title}`,
      preheader: `Your ${formatPhp(amount)} gift helps keep the concert free for everyone.`,
      eyebrow: 'Patronage · Thank you',
      title: 'Thank you for your gift',
      intro: [
        greeting(name),
        `Your ${formatPhp(amount)} gift helps keep ${eventConfig.title} free for the parish and community — supporting production essentials and artist hospitality.`,
        `${eventConfig.organizer} will confirm once your transfer is received. ${eventConfig.surplusCopy}`,
      ],
      recordId,
      sections,
      longText: message ? { heading: 'Your message', body: message } : undefined,
    },
  }
}

export function prepareSubmission<T extends FormType>(type: T, data: FormDataMap[T]): PreparedSubmission {
  if (!data || typeof data !== 'object') fail('Missing form data.')
  switch (type) {
    case 'merch':
      return prepareMerch(data as MerchData)
    case 'rsvp':
      return prepareRsvp(data as RsvpData)
    case 'partner':
      return preparePartner(data as PartnerData)
    case 'gift':
      return prepareGift(data as GiftData)
    default:
      fail('Unknown form type.')
  }
}
