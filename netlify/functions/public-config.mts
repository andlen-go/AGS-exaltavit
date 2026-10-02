import { FORM_TYPES, type FormType, type PublicConfig } from '../../src/shared/forms'
import { json } from '../lib/http'
import { isEmailConfigured, loadSettings } from '../lib/settings'

function byForm(pick: (type: FormType) => boolean): Record<FormType, boolean> {
  return Object.fromEntries(FORM_TYPES.map((type) => [type, pick(type)])) as Record<FormType, boolean>
}

export default async () => {
  try {
    const settings = await loadSettings()
    const ready = isEmailConfigured(settings)
    return json(200, {
      forms: byForm((type) => ready && settings.forms[type].enabled),
      copies: byForm((type) => settings.forms[type].sendCopy),
    } satisfies PublicConfig)
  } catch (error) {
    console.error('public-config failed', error)
    return json(200, { forms: byForm(() => false), copies: byForm(() => false) } satisfies PublicConfig)
  }
}
