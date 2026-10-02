import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { eventConfig } from '../config/event'
import { BrandLogo, Button, Field, Input, Notice, Textarea } from '../components/ui'
import {
  FORM_LABELS,
  FORM_TYPES,
  type AdminSettingsUpdate,
  type AdminSettingsView,
  type FormType,
} from '../shared/forms'

type ApiResult<T> = ({ ok: true } & T) | { ok: false; error: string; status: number }

async function api<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`/api/${path}`, {
      credentials: 'same-origin',
      ...init,
      headers: init?.body ? { 'content-type': 'application/json' } : undefined,
    })
    const body = (await response.json().catch(() => null)) as ({ ok: boolean; error?: string } & T) | null
    if (!body) {
      return {
        ok: false,
        status: response.status,
        error: 'The admin API is not reachable. On a local machine, run `npm run dev:netlify` instead of `npm run dev`.',
      }
    }
    if (!response.ok || !body.ok) return { ok: false, status: response.status, error: body.error ?? 'Request failed.' }
    return body as { ok: true } & T
  } catch {
    return { ok: false, status: 0, error: 'Network error — check your connection.' }
  }
}

function toDraft(view: AdminSettingsView): AdminSettingsUpdate {
  return {
    organizerEmails: view.organizerEmails,
    fromName: view.fromName,
    fromEmail: view.fromEmail,
    replyTo: view.replyTo,
    smtp: { host: view.smtp.host, port: view.smtp.port, username: view.smtp.username, secure: view.smtp.secure, password: '' },
    forms: view.forms,
    emailFooter: view.emailFooter,
  }
}

export default function AdminPage() {
  const [phase, setPhase] = useState<'loading' | 'login' | 'ready'>('loading')
  const [settings, setSettings] = useState<AdminSettingsView | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    document.title = `Admin · ${eventConfig.title}`
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    return () => robots.remove()
  }, [])

  useEffect(() => {
    let alive = true
    api<{ settings: AdminSettingsView }>('admin-settings').then((result) => {
      if (!alive) return
      if (result.ok) {
        setSettings(result.settings)
        setPhase('ready')
      } else {
        if (result.status !== 401) setLoadError(result.error)
        setPhase('login')
      }
    })
    return () => {
      alive = false
    }
  }, [])

  async function onLoggedIn() {
    const result = await api<{ settings: AdminSettingsView }>('admin-settings')
    if (result.ok) {
      setSettings(result.settings)
      setLoadError(null)
      setPhase('ready')
    } else {
      setLoadError(result.error)
    }
  }

  async function logout() {
    await api('admin-logout', { method: 'POST' })
    setSettings(null)
    setPhase('login')
  }

  return (
    <div className="min-h-dvh bg-ivory-deep/40">
      <header className="bg-navy px-4 py-5 text-ivory sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <BrandLogo className="h-12 w-auto" decorative />
            <span>
              <span className="block text-[11px] font-semibold tracking-[0.22em] text-gold-soft uppercase">
                {eventConfig.organizer}
              </span>
              <span className="block font-display text-2xl leading-tight">Site admin</span>
            </span>
          </a>
          {phase === 'ready' ? (
            <Button type="button" variant="onDark" onClick={logout}>
              Log out
            </Button>
          ) : (
            <a href="/" className="text-sm text-ivory/70 hover:text-ivory">
              ← Back to site
            </a>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {phase === 'loading' ? <p className="text-sm text-navy/60">Loading…</p> : null}
        {phase === 'login' ? <LoginForm onSuccess={onLoggedIn} externalError={loadError} /> : null}
        {phase === 'ready' && settings ? (
          <SettingsForm settings={settings} onSaved={setSettings} onUnauthorized={() => setPhase('login')} />
        ) : null}
      </main>
    </div>
  )
}

function LoginForm({ onSuccess, externalError }: { onSuccess: () => void; externalError: string | null }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    const result = await api('admin-login', { method: 'POST', body: JSON.stringify({ password }) })
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setPassword('')
    onSuccess()
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-5 rounded-lg border border-navy/10 bg-ivory p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Organizer access</p>
        <h1 className="mt-1 font-display text-3xl text-navy">Log in</h1>
        <p className="mt-2 text-sm text-navy/65">Manage where form submissions are emailed and how they are sent.</p>
      </div>
      <Field label="Admin password">
        <Input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
          required
        />
      </Field>
      {error || externalError ? <Notice tone="warn">{error ?? externalError}</Notice> : null}
      <Button type="submit" variant="gold" className="w-full" disabled={busy || !password}>
        {busy ? 'Checking…' : 'Log in'}
      </Button>
    </form>
  )
}

function Card({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-navy/10 bg-ivory p-5 shadow-sm sm:p-6">
      <h2 className="font-display text-2xl text-navy">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-relaxed text-navy/65">{description}</p> : null}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm text-navy/80">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  )
}

function SettingsForm({
  settings,
  onSaved,
  onUnauthorized,
}: {
  settings: AdminSettingsView
  onSaved: (settings: AdminSettingsView) => void
  onUnauthorized: () => void
}) {
  const [draft, setDraft] = useState<AdminSettingsUpdate>(() => toDraft(settings))
  const [recipients, setRecipients] = useState(settings.organizerEmails.join('\n'))
  const [busy, setBusy] = useState<'save' | 'test' | null>(null)
  const [notice, setNotice] = useState<{ tone: 'success' | 'warn'; text: string } | null>(null)

  function setSmtp<K extends keyof AdminSettingsUpdate['smtp']>(key: K, value: AdminSettingsUpdate['smtp'][K]) {
    setDraft((current) => ({ ...current, smtp: { ...current.smtp, [key]: value } }))
  }

  function setForm(type: FormType, key: 'enabled' | 'sendCopy', value: boolean) {
    setDraft((current) => ({ ...current, forms: { ...current.forms, [type]: { ...current.forms[type], [key]: value } } }))
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    setBusy('save')
    setNotice(null)
    const organizerEmails = recipients
      .split(/[\s,;]+/)
      .map((email) => email.trim())
      .filter(Boolean)
    const result = await api<{ settings: AdminSettingsView }>('admin-settings', {
      method: 'PUT',
      body: JSON.stringify({ ...draft, organizerEmails }),
    })
    setBusy(null)
    if (!result.ok) {
      if (result.status === 401) return onUnauthorized()
      setNotice({ tone: 'warn', text: result.error })
      return
    }
    onSaved(result.settings)
    setDraft(toDraft(result.settings))
    setRecipients(result.settings.organizerEmails.join('\n'))
    setNotice({ tone: 'success', text: 'Settings saved.' })
  }

  async function sendTest() {
    setBusy('test')
    setNotice(null)
    const result = await api<{ sentTo: string[] }>('admin-test-email', { method: 'POST' })
    setBusy(null)
    if (!result.ok) {
      if (result.status === 401) return onUnauthorized()
      setNotice({ tone: 'warn', text: result.error })
      return
    }
    setNotice({ tone: 'success', text: `Test email sent to ${result.sentTo.join(', ')}. Check the inbox (and spam folder).` })
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-navy">Email settings</h1>
          <p className="mt-1 text-sm text-navy/60">
            {settings.updatedAt ? `Last saved ${new Date(settings.updatedAt).toLocaleString('en-PH')}` : 'Not saved yet'}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
            settings.configured ? 'bg-gold/15 text-navy' : 'bg-navy/10 text-navy/70'
          }`}
        >
          {settings.configured ? '● Email configured' : '○ Email not configured'}
        </span>
      </div>

      <Card
        title="Recipients"
        description="Organizer inboxes that receive every submission. One address per line."
      >
        <Field label="Organizer emails">
          <Textarea rows={3} value={recipients} onChange={(event) => setRecipients(event.target.value)} />
        </Field>
      </Card>

      <Card
        title="Sender"
        description="How emails appear in inboxes. The sender email must be a verified sender or domain in Elastic Email."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="From name">
            <Input value={draft.fromName} onChange={(event) => setDraft({ ...draft, fromName: event.target.value })} />
          </Field>
          <Field label="From email">
            <Input
              type="email"
              value={draft.fromEmail}
              placeholder="noreply@yourdomain.com"
              onChange={(event) => setDraft({ ...draft, fromEmail: event.target.value })}
            />
          </Field>
        </div>
        <Field label="Reply-to (optional)" hint="Where visitors’ replies to their copy go. Defaults to the first organizer email.">
          <Input type="email" value={draft.replyTo} onChange={(event) => setDraft({ ...draft, replyTo: event.target.value })} />
        </Field>
      </Card>

      <Card
        title="SMTP"
        description="Elastic Email: Settings → SMTP. Use your SMTP username and the generated SMTP password (or API key)."
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
          <Field label="Host">
            <Input value={draft.smtp.host} onChange={(event) => setSmtp('host', event.target.value)} />
          </Field>
          <Field label="Port">
            <Input
              inputMode="numeric"
              value={String(draft.smtp.port || '')}
              onChange={(event) => setSmtp('port', Number(event.target.value.replace(/[^\d]/g, '')))}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Username">
            <Input autoComplete="off" value={draft.smtp.username} onChange={(event) => setSmtp('username', event.target.value)} />
          </Field>
          <Field label="Password" hint={settings.smtp.hasPassword ? 'Saved — leave blank to keep it' : 'Not set'}>
            <Input
              type="password"
              autoComplete="new-password"
              value={draft.smtp.password}
              placeholder={settings.smtp.hasPassword ? '••••••••' : ''}
              onChange={(event) => setSmtp('password', event.target.value)}
            />
          </Field>
        </div>
        <Toggle
          checked={draft.smtp.secure}
          onChange={(value) => setSmtp('secure', value)}
          label="Use implicit TLS (port 465). Leave off for ports 2525 or 587, which upgrade with STARTTLS."
        />
      </Card>

      <Card title="Forms" description="Turn each form on or off, and choose whether the visitor receives a copy.">
        <ul className="divide-y divide-navy/10">
          {FORM_TYPES.map((type) => (
            <li key={type} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-medium text-navy">{FORM_LABELS[type]}</span>
              <span className="flex gap-5">
                <Toggle checked={draft.forms[type].enabled} onChange={(value) => setForm(type, 'enabled', value)} label="Enabled" />
                <Toggle
                  checked={draft.forms[type].sendCopy}
                  onChange={(value) => setForm(type, 'sendCopy', value)}
                  label="Send copy to visitor"
                />
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Email footer" description="Shown at the bottom of every email.">
        <Input value={draft.emailFooter} onChange={(event) => setDraft({ ...draft, emailFooter: event.target.value })} />
      </Card>

      {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap gap-3 border-t border-navy/10 bg-ivory/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
        <Button type="submit" variant="gold" disabled={busy !== null}>
          {busy === 'save' ? 'Saving…' : 'Save settings'}
        </Button>
        <Button type="button" variant="secondary" disabled={busy !== null || !settings.configured} onClick={sendTest}>
          {busy === 'test' ? 'Sending…' : 'Send test email'}
        </Button>
        {!settings.configured ? (
          <span className="self-center text-xs text-navy/55">Save recipients, sender, and SMTP to enable the test.</span>
        ) : null}
      </div>
    </form>
  )
}
