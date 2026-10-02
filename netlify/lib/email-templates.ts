import { eventConfig, getTimeDisplay } from '../../src/config/event'

export type Row = [label: string, value: string]

export type ItemRow = { name: string; variant: string; quantity: number; amount: string }

export type EmailContent = {
  subject: string
  preheader: string
  eyebrow: string
  title: string
  /** Paragraphs */
  intro: string[]
  recordId?: string
  sections: { heading: string; rows: Row[] }[]
  items?: { rows: ItemRow[]; totals: Row[]; grandTotal: Row }
  longText?: { heading: string; body: string }
  note?: string
}

export type RenderedEmail = { subject: string; html: string; text: string }

const C = {
  navy: '#101f32',
  navySoft: '#1a2f4a',
  ivory: '#f7f2e9',
  ivoryDeep: '#ebe3d4',
  gold: '#a5783e',
  goldSoft: '#c49a5c',
  muted: '#5b6573',
  line: '#ddd3c1',
}
const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
const SANS = "'Source Sans 3', 'Segoe UI', Helvetica, Arial, sans-serif"

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function multiline(value: string): string {
  return esc(value).replace(/\r?\n/g, '<br>')
}

function siteUrl(): string {
  // URL is set by Netlify to the site's primary address; eventConfig.siteUrl is the build-time fallback.
  const url = process.env.VITE_SITE_URL || process.env.URL || eventConfig.siteUrl
  return url.replace(/\/$/, '')
}

function sectionHeading(text: string): string {
  return `<p style="margin:28px 0 10px;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:2.4px;text-transform:uppercase;color:${C.gold};">${esc(text)}</p>`
}

function rowsTable(rows: Row[]): string {
  const body = rows
    .map(
      ([label, value], index) => `
      <tr>
        <td valign="top" style="padding:10px 12px 10px 0;width:38%;font-family:${SANS};font-size:13px;color:${C.muted};${index ? `border-top:1px solid ${C.line};` : ''}">${esc(label)}</td>
        <td valign="top" style="padding:10px 0;font-family:${SANS};font-size:14px;color:${C.navy};font-weight:600;${index ? `border-top:1px solid ${C.line};` : ''}">${multiline(value)}</td>
      </tr>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${body}</table>`
}

function itemsTable(items: NonNullable<EmailContent['items']>): string {
  const rows = items.rows
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-top:1px solid ${C.line};font-family:${SANS};font-size:14px;color:${C.navy};">
          <strong>${esc(item.name)}</strong><br>
          <span style="font-size:12px;color:${C.muted};">${esc(item.variant)}</span>
        </td>
        <td align="center" style="padding:12px 8px;border-top:1px solid ${C.line};font-family:${SANS};font-size:14px;color:${C.navy};">× ${item.quantity}</td>
        <td align="right" style="padding:12px 0;border-top:1px solid ${C.line};font-family:${SANS};font-size:14px;color:${C.navy};font-weight:600;">${esc(item.amount)}</td>
      </tr>`,
    )
    .join('')
  const totals = items.totals
    .map(
      ([label, value]) => `
      <tr>
        <td colspan="2" style="padding:6px 0;font-family:${SANS};font-size:13px;color:${C.muted};">${esc(label)}</td>
        <td align="right" style="padding:6px 0;font-family:${SANS};font-size:13px;color:${C.navy};">${esc(value)}</td>
      </tr>`,
    )
    .join('')
  const [grandLabel, grandValue] = items.grandTotal
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:0 0 8px;font-family:${SANS};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};">Item</td>
        <td align="center" style="padding:0 8px 8px;font-family:${SANS};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};">Qty</td>
        <td align="right" style="padding:0 0 8px;font-family:${SANS};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};">Amount</td>
      </tr>
      ${rows}
      <tr><td colspan="3" style="border-top:1px solid ${C.line};padding-top:8px;"></td></tr>
      ${totals}
      <tr>
        <td colspan="2" style="padding:14px 0 0;border-top:2px solid ${C.gold};font-family:${SANS};font-size:14px;font-weight:700;color:${C.navy};">${esc(grandLabel)}</td>
        <td align="right" style="padding:14px 0 0;border-top:2px solid ${C.gold};font-family:${SERIF};font-size:28px;color:${C.navy};">${esc(grandValue)}</td>
      </tr>
    </table>`
}

function eventCard(): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;background:${C.navy};border-radius:6px;">
      <tr>
        <td style="padding:22px 24px;">
          <p style="margin:0;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:2.4px;text-transform:uppercase;color:${C.goldSoft};">The concert</p>
          <p style="margin:6px 0 0;font-family:${SERIF};font-size:26px;line-height:1.2;color:${C.ivory};">${esc(eventConfig.title)} &middot; ${esc(eventConfig.subtitle)}</p>
          <p style="margin:8px 0 0;font-family:${SANS};font-size:14px;line-height:1.6;color:${C.ivory};opacity:0.8;">
            ${esc(eventConfig.dateLabel)} &middot; ${esc(getTimeDisplay())}<br>
            ${esc(eventConfig.venue)}, ${esc(eventConfig.venueCity)}<br>
            Free admission
          </p>
        </td>
      </tr>
    </table>`
}

export function renderEmail(content: EmailContent, footer: string): RenderedEmail {
  const base = siteUrl()
  const intro = content.intro
    .map(
      (paragraph) =>
        `<p style="margin:0 0 14px;font-family:${SANS};font-size:15px;line-height:1.65;color:${C.navy};">${multiline(paragraph)}</p>`,
    )
    .join('')
  const record = content.recordId
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 4px;"><tr><td style="padding:8px 14px;border:1px solid ${C.goldSoft};border-radius:999px;font-family:${SANS};font-size:12px;letter-spacing:1px;color:${C.navy};">Record ID &nbsp;<strong style="letter-spacing:0.5px;">${esc(content.recordId)}</strong></td></tr></table>`
    : ''
  const items = content.items ? sectionHeading('Order summary') + itemsTable(content.items) : ''
  const sections = content.sections.map((section) => sectionHeading(section.heading) + rowsTable(section.rows)).join('')
  const longText = content.longText
    ? sectionHeading(content.longText.heading) +
      `<div style="padding:16px 18px;background:${C.ivoryDeep};border-left:3px solid ${C.gold};font-family:${SANS};font-size:14px;line-height:1.65;color:${C.navy};">${multiline(content.longText.body)}</div>`
    : ''
  const note = content.note
    ? `<p style="margin:24px 0 0;padding:14px 16px;background:#fff;border:1px solid ${C.line};border-radius:4px;font-family:${SANS};font-size:13px;line-height:1.6;color:${C.muted};">${multiline(content.note)}</p>`
    : ''

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(content.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.ivoryDeep};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(content.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.ivoryDeep};">
  <tr>
    <td align="center" style="padding:28px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${C.ivory};border-radius:8px;overflow:hidden;">
        <tr>
          <td style="background:${C.navy};padding:28px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="middle" style="padding-right:18px;">
                  <img src="${base}/brand/ags-logo-480.png" width="32" height="79" alt="${esc(eventConfig.organizer)}" style="display:block;border:0;">
                </td>
                <td valign="middle">
                  <p style="margin:0;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:2.6px;text-transform:uppercase;color:${C.goldSoft};">${esc(content.eyebrow)}</p>
                  <h1 style="margin:6px 0 0;font-family:${SERIF};font-size:32px;line-height:1.15;font-weight:500;color:${C.ivory};">${esc(content.title)}</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height:3px;background:${C.gold};font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr>
          <td style="padding:32px;">
            ${intro}
            ${record}
            ${items}
            ${sections}
            ${longText}
            ${note}
            ${eventCard()}
          </td>
        </tr>
        <tr>
          <td style="background:${C.navySoft};padding:22px 32px;">
            <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.ivory};opacity:0.75;">${esc(footer)}</p>
            <p style="margin:6px 0 0;font-family:${SANS};font-size:12px;"><a href="${base}" style="color:${C.goldSoft};text-decoration:none;">${esc(base.replace(/^https?:\/\//, ''))}</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`

  const text = [
    `${content.eyebrow.toUpperCase()} — ${content.title}`,
    '',
    ...content.intro.flatMap((paragraph) => [paragraph, '']),
    ...(content.recordId ? [`Record ID: ${content.recordId}`, ''] : []),
    ...(content.items
      ? [
          'ORDER SUMMARY',
          ...content.items.rows.map((item) => `- ${item.name} (${item.variant}) × ${item.quantity} = ${item.amount}`),
          ...content.items.totals.map(([label, value]) => `${label}: ${value}`),
          `${content.items.grandTotal[0]}: ${content.items.grandTotal[1]}`,
          '',
        ]
      : []),
    ...content.sections.flatMap((section) => [
      section.heading.toUpperCase(),
      ...section.rows.map(([label, value]) => `${label}: ${value}`),
      '',
    ]),
    ...(content.longText ? [content.longText.heading.toUpperCase(), content.longText.body, ''] : []),
    ...(content.note ? [content.note, ''] : []),
    `${eventConfig.title} · ${eventConfig.dateLabel} · ${getTimeDisplay()}`,
    `${eventConfig.venue}, ${eventConfig.venueCity}`,
    '',
    footer,
    base,
  ].join('\n')

  return { subject: content.subject, html, text }
}
