import { AppBit } from '@o/models'

import { getAppDefinition } from './getAppDefinition'

export function appDefinesClient(app: AppBit) {
  const def = getAppDefinition(app.identifier)
  return def && !!def.app
}
