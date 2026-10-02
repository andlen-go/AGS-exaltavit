/** Types and validation shared by the site forms, the admin page, and Netlify Functions. */

export const FORM_TYPES = ['merch', 'rsvp', 'partner', 'gift'] as const
export type FormType = (typeof FORM_TYPES)[number]

export const FORM_LABELS: Record<FormType, string> = {
  merch: 'Keepsake pre-orders',
  rsvp: 'Let us know you’re coming (RSVP)',
  partner: 'Partnership inquiries',
  gift: 'Support Exaltavit gifts',
}

export type MerchLineInput = { productId: string; variantId: string; quantity: number }

export type MerchData = {
  name: string
  email: string
  mobile: string
  donationAddonPhp: number
  policyAck: boolean
  lines: MerchLineInput[]
}

export type RsvpData = {
  name: string
  email: string
  mobile: string
  partySize: number
  invitedBy: string
  assistance: string
}

export type PartnerData = {
  name: string
  email: string
  mobile: string
  kind: 'cash' | 'in-kind'
  category: string
  proposal: string
  recognize: boolean
}

export type PhotoAttachment = { filename: string; contentType: string; base64: string }

export type GiftData = {
  amountPhp: number
  name: string
  email: string
  mobile: string
  message: string
  recognize: boolean
  displayAs: 'individual' | 'organization'
  displayName: string
  blurb: string
  link: string
  photoLink: string
  photo?: PhotoAttachment
}

export type FormDataMap = {
  merch: MerchData
  rsvp: RsvpData
  partner: PartnerData
  gift: GiftData
}

export type SubmitRequest<T extends FormType = FormType> = {
  type: T
  data: FormDataMap[T]
  /** Honeypot — must stay empty */
  hp: string
  /** Epoch ms when the form was opened */
  startedAt: number
}

export type SubmitResponse =
  | { ok: true; recordId: string; copySentTo: string | null }
  | { ok: false; error: string }

export type PublicConfig = {
  forms: Record<FormType, boolean>
  /** Whether the visitor gets a copy (admin "Send copy to visitor") */
  copies: Record<FormType, boolean>
}

export type FormSettings = { enabled: boolean; sendCopy: boolean }

export type AdminSettingsView = {
  organizerEmails: string[]
  fromName: string
  fromEmail: string
  replyTo: string
  smtp: { host: string; port: number; username: string; secure: boolean; hasPassword: boolean }
  forms: Record<FormType, FormSettings>
  emailFooter: string
  configured: boolean
  updatedAt: string | null
}

export type AdminSettingsUpdate = Omit<AdminSettingsView, 'smtp' | 'configured' | 'updatedAt'> & {
  /** Blank password keeps the stored one */
  smtp: { host: string; port: number; username: string; secure: boolean; password: string }
}

export const MAX_PHOTO_BYTES = 4 * 1024 * 1024

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

/** Accepts 09XXXXXXXXX or +639XXXXXXXXX (spaces/dashes ignored). Empty is valid (field is optional). */
export function isValidMobile(value: string): boolean {
  const compact = value.replace(/[\s-]/g, '')
  return compact === '' || /^(09\d{9}|\+639\d{9})$/.test(compact)
}
