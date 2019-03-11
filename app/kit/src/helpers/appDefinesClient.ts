import { AppBit } from '@o/models'
import { getAppDefinition } from './getAppDefinition'

export function appDefinesClient(app: AppBit) {
  return !!getAppDefinition(app.identifier).app
}
