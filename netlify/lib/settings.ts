import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import { eventConfig } from '../../src/config/event'
import {
  FORM_TYPES,
  isValidEmail,
  type AdminSettingsUpdate,
  type AdminSettingsView,
  type FormSettings,
  type FormType,
} from '../../src/shared/forms'

type StoredSettings = Omit<AdminSettingsView, 'smtp' | 'configured'> & {
  smtp: { host: string; port: number; username: string; secure: boolean; passwordEnc: string | null }
}

export type ResolvedSettings = StoredSettings & { smtpPassword: string | null }

const STORE_NAME = 'site-settings'
const SETTINGS_KEY = 'settings'

function defaultSettings(): StoredSettings {
  const forms = Object.fromEntries(
    FORM_TYPES.map((type) => [type, { enabled: true, sendCopy: true }]),
  ) as Record<FormType, FormSettings>
  return {
    organizerEmails: [eventConfig.organizerEmail],
    fromName: eventConfig.organizer,
    fromEmail: '',
    replyTo: '',
    smtp: { host: 'smtp.elasticemail.com', port: 2525, username: '', secure: false, passwordEnc: null },
    forms,
    emailFooter: `${eventConfig.organizer} · ${eventConfig.title} · ${eventConfig.dateLabel}`,
    updatedAt: null,
  }
}

function encryptionKey(): Buffer {
  const raw = process.env.SETTINGS_ENCRYPTION_KEY ?? ''
  const key = Buffer.from(raw, 'base64')
  if (key.length !== 32) throw new Error('SETTINGS_ENCRYPTION_KEY must be 32 bytes, base64-encoded.')
  return key
}

function encrypt(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv)
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  return ['v1', iv.toString('base64'), cipher.getAuthTag().toString('base64'), data.toString('base64')].join(':')
}

function decrypt(payload: string): string | null {
  try {
    const [version, iv, tag, data] = payload.split(':')
    if (version !== 'v1' || !iv || !tag || !data) return null
    const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(iv, 'base64'))
    decipher.setAuthTag(Buffer.from(tag, 'base64'))
    return Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]).toString('utf8')
  } catch {
    return null
  }
}

function store() {
  return getStore({ name: STORE_NAME, consistency: 'strong' })
}

async function readStored(): Promise<StoredSettings> {
  const defaults = defaultSettings()
  const saved = (await store().get(SETTINGS_KEY, { type: 'json' })) as Partial<StoredSettings> | null
  if (!saved) return defaults
  return {
    ...defaults,
    ...saved,
    smtp: { ...defaults.smtp, ...saved.smtp },
    forms: Object.fromEntries(
      FORM_TYPES.map((type) => [type, { ...defaults.forms[type], ...saved.forms?.[type] }]),
    ) as Record<FormType, FormSettings>,
  }
}

export async function loadSettings(): Promise<ResolvedSettings> {
  const stored = await readStored()
  return { ...stored, smtpPassword: stored.smtp.passwordEnc ? decrypt(stored.smtp.passwordEnc) : null }
}

export function isEmailConfigured(settings: ResolvedSettings): boolean {
  return Boolean(
    settings.organizerEmails.length > 0 &&
      settings.fromEmail &&
      settings.smtp.host &&
      settings.smtp.port &&
      settings.smtp.username &&
      settings.smtpPassword,
  )
}

export function toAdminView(settings: ResolvedSettings): AdminSettingsView {
  const { smtpPassword, smtp, ...rest } = settings
  return {
    ...rest,
    smtp: {
      host: smtp.host,
      port: smtp.port,
      username: smtp.username,
      secure: smtp.secure,
      hasPassword: Boolean(smtpPassword),
    },
    configured: isEmailConfigured(settings),
  }
}

/** Validates an admin update; returns an error message or the merged settings to save. */
export async function saveSettings(update: AdminSettingsUpdate): Promise<string | ResolvedSettings> {
  const current = await readStored()
  const organizerEmails = (update.organizerEmails ?? []).map((email) => email.trim()).filter(Boolean)
  if (organizerEmails.length === 0) return 'Add at least one organizer email.'
  const badRecipient = organizerEmails.find((email) => !isValidEmail(email))
  if (badRecipient) return `“${badRecipient}” is not a valid email address.`
  const fromEmail = update.fromEmail?.trim() ?? ''
  if (fromEmail && !isValidEmail(fromEmail)) return 'Sender email is not a valid email address.'
  const replyTo = update.replyTo?.trim() ?? ''
  if (replyTo && !isValidEmail(replyTo)) return 'Reply-to is not a valid email address.'
  const port = Number(update.smtp?.port)
  if (!Number.isInteger(port) || port < 1 || port > 65535) return 'SMTP port must be a number between 1 and 65535.'

  const password = update.smtp?.password ?? ''
  const next: StoredSettings = {
    organizerEmails,
    fromName: update.fromName?.trim() || eventConfig.organizer,
    fromEmail,
    replyTo,
    smtp: {
      host: update.smtp?.host?.trim() ?? '',
      port,
      username: update.smtp?.username?.trim() ?? '',
      secure: Boolean(update.smtp?.secure),
      passwordEnc: password ? encrypt(password) : current.smtp.passwordEnc,
    },
    forms: Object.fromEntries(
      FORM_TYPES.map((type) => [
        type,
        {
          enabled: Boolean(update.forms?.[type]?.enabled),
          sendCopy: Boolean(update.forms?.[type]?.sendCopy),
        },
      ]),
    ) as Record<FormType, FormSettings>,
    emailFooter: update.emailFooter?.trim() ?? '',
    updatedAt: new Date().toISOString(),
  }
  await store().setJSON(SETTINGS_KEY, next)
  return { ...next, smtpPassword: next.smtp.passwordEnc ? decrypt(next.smtp.passwordEnc) : null }
}
