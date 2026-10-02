import { useEffect, useState, type ChangeEvent } from 'react'
import { loadPublicConfig, submitForm } from '../lib/submitForm'
import type { FormDataMap, FormType, SubmitResponse } from '../shared/forms'

/**
 * Whether a form is accepting submissions (organizer email + SMTP configured and the form enabled in /admin).
 * Optimistically true while loading or when the backend can't be reached; the server still rejects if disabled.
 */
export function useFormEnabled(type: FormType): boolean {
  const [enabled, setEnabled] = useState(true)
  useEffect(() => {
    let alive = true
    loadPublicConfig().then((config) => {
      if (alive && config) setEnabled(config.forms[type])
    })
    return () => {
      alive = false
    }
  }, [type])
  return enabled
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
