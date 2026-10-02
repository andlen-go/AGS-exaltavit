import { useEffect, useState, type ChangeEvent } from 'react'
import { loadPublicConfig, submitForm } from '../lib/submitForm'
import type { FormDataMap, FormType, SubmitResponse } from '../shared/forms'

/**
 * Whether a form is accepting submissions (organizer email + SMTP configured and the form enabled in /admin).
 * Optimistically true while loading or when the backend can't be reached; the server still rejects if disabled.
 */
export function useFormEnabled(type: FormType): boolean {
  return useFormStatus(type).enabled
}

/** `sendsCopy` mirrors the admin "Send copy to visitor" toggle so confirmations don't promise a copy that won't come. */
export function useFormStatus(type: FormType): { enabled: boolean; sendsCopy: boolean } {
  const [status, setStatus] = useState({ enabled: true, sendsCopy: true })
  useEffect(() => {
    let alive = true
    loadPublicConfig().then((config) => {
      if (alive && config) setStatus({ enabled: config.forms[type], sendsCopy: config.copies?.[type] ?? true })
    })
    return () => {
      alive = false
    }
  }, [type])
  return status
}

/** Sending state plus the honeypot/timing guard the send-form function expects. */
export function useFormSubmit<T extends FormType>(type: T) {
  const [startedAt] = useState(() => Date.now())
  const [hp, setHp] = useState('')
  const [sending, setSending] = useState(false)

  async function submit(data: FormDataMap[T]): Promise<SubmitResponse> {
    setSending(true)
    try {
      return await submitForm(type, data, { hp, startedAt })
    } finally {
      setSending(false)
    }
  }

  return {
    submit,
    sending,
    honeypotProps: {
      value: hp,
      onChange: (event: ChangeEvent<HTMLInputElement>) => setHp(event.target.value),
    },
  }
}
