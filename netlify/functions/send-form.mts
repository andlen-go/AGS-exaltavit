import { FORM_TYPES, type FormType, type SubmitRequest, type SubmitResponse } from '../../src/shared/forms'
import { renderEmail } from '../lib/email-templates'
import { prepareSubmission, ValidationError } from '../lib/form-emails'
import { json, readJson } from '../lib/http'
import { createMailer } from '../lib/mailer'
import { isEmailConfigured, loadSettings } from '../lib/settings'

const MIN_FILL_MS = 2500

function respond(status: number, body: SubmitResponse) {
  return json(status, body)
}

export default async (request: Request) => {
  if (request.method !== 'POST') return respond(405, { ok: false, error: 'Method not allowed.' })

  const body = await readJson<SubmitRequest>(request)
  if (!body || !FORM_TYPES.includes(body.type as FormType)) {
    return respond(400, { ok: false, error: 'Invalid request.' })
  }
  // Bots that fill the honeypot or submit instantly get a fake success so they don't retry.
  if (body.hp || !body.startedAt || Date.now() - Number(body.startedAt) < MIN_FILL_MS) {
    return respond(200, { ok: true, recordId: 'RECEIVED', copySentTo: null })
  }

  const settings = await loadSettings()
  const formSettings = settings.forms[body.type]
  if (!formSettings.enabled || !isEmailConfigured(settings)) {
    return respond(503, {
      ok: false,
      error: 'This form is not accepting submissions right now. Please contact the organizer directly.',
    })
  }

  let prepared
  try {
    prepared = prepareSubmission(body.type, body.data)
  } catch (error) {
    if (error instanceof ValidationError) return respond(400, { ok: false, error: error.message })
    throw error
  }

  const footer = settings.emailFooter
  const mailer = createMailer(settings)
  try {
    await mailer.send({
      ...renderEmail(prepared.organizer, footer),
      to: settings.organizerEmails,
      replyTo: prepared.submitterEmail ?? undefined,
      attachments: prepared.attachments,
    })
  } catch (error) {
    console.error('send-form: organizer email failed', error)
    mailer.close()
    return respond(502, {
      ok: false,
      error: 'We couldn’t send your request just now. Please try again in a few minutes.',
    })
  }

  let copySentTo: string | null = null
  if (formSettings.sendCopy && prepared.submitterEmail) {
    try {
      await mailer.send({
        ...renderEmail(prepared.visitor, footer),
        to: prepared.submitterEmail,
        replyTo: settings.replyTo || settings.organizerEmails[0],
        attachments: prepared.attachments,
      })
      copySentTo = prepared.submitterEmail
    } catch (error) {
      // The organizer already has the request; a failed copy shouldn't fail the submission.
      console.error('send-form: visitor copy failed', error)
    }
  }
  mailer.close()

  return respond(200, { ok: true, recordId: prepared.recordId, copySentTo })
}
