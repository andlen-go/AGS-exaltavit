import nodemailer from 'nodemailer'
import type { RenderedEmail } from './email-templates'
import type { Attachment } from './form-emails'
import type { ResolvedSettings } from './settings'

export type OutgoingEmail = RenderedEmail & {
  to: string | string[]
  replyTo?: string
  attachments?: Attachment[]
}

export function createMailer(settings: ResolvedSettings) {
  const transport = nodemailer.createTransport({
    host: settings.smtp.host,
    port: settings.smtp.port,
    secure: settings.smtp.secure,
    auth: { user: settings.smtp.username, pass: settings.smtpPassword ?? '' },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  })
  const from = { name: settings.fromName, address: settings.fromEmail }

  return {
    send(email: OutgoingEmail) {
      return transport.sendMail({
        from,
        to: email.to,
        replyTo: email.replyTo || settings.replyTo || undefined,
        subject: email.subject,
        html: email.html,
        text: email.text,
        attachments: email.attachments,
      })
    },
    close() {
      transport.close()
    },
  }
}
