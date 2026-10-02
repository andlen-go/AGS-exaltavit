import { FORM_TYPES, type FormType, type PublicConfig } from '../../src/shared/forms'
import { json } from '../lib/http'
import { isEmailConfigured, loadSettings } from '../lib/settings'

export default async () => {
  try {
    const settings = await loadSettings()
    const ready = isEmailConfigured(settings)
    const forms = Object.fromEntries(
      FORM_TYPES.map((type) => [type, ready && settings.forms[type].enabled]),
    ) as Record<FormType, boolean>
    return json(200, { forms } satisfies PublicConfig)
  } catch (error) {
    console.error('public-config failed', error)
    const forms = Object.fromEntries(FORM_TYPES.map((type) => [type, false])) as Record<FormType, boolean>
    return json(200, { forms } satisfies PublicConfig)
  }
}
