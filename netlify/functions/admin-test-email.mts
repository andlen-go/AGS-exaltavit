import { renderEmail } from '../lib/email-templates'
import { json } from '../lib/http'
import { createMailer } from '../lib/mailer'
import { isAuthenticated } from '../lib/session'
import { isEmailConfigured, loadSettings } from '../lib/settings'

export default async (request: Request) => {
  if (!isAuthenticated(request)) return json(401, { ok: false, error: 'Please log in again.' })
  if (request.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed.' })

  const settings = await loadSettings()
  if (!isEmailConfigured(settings)) {
    return json(400, { ok: false, error: 'Save the organizer email, sender email, and SMTP credentials first.' })
  }

  const mailer = createMailer(settings)
  try {
    await mailer.send({
      ...renderEmail(
        {
          subject: 'Exaltavit site — test email',
          preheader: 'Your SMTP settings are working.',
          eyebrow: 'Admin · Test',
          title: 'Email is working',
          intro: [
            'This is a test message from the Exaltavit site admin page. If you can read it, form submissions will reach this inbox.',
          ],
          sections: [
            {
              heading: 'Current settings',
              rows: [
                ['Recipients', settings.organizerEmails.join(', ')],
                ['Sender', `${settings.fromName} <${settings.fromEmail}>`],
                ['SMTP server', `${settings.smtp.host}:${settings.smtp.port}`],
              ],
            },
          ],
        },
        settings.emailFooter,
      ),
      to: settings.organizerEmails,
    })
    return json(200, { ok: true, sentTo: settings.organizerEmails })
  } catch (error) {
    console.error('admin-test-email failed', error)
    const message = error instanceof Error ? error.message : 'Unknown SMTP error.'
    return json(502, { ok: false, error: `SMTP error: ${message}` })
  } finally {
    mailer.close()
  }
}
