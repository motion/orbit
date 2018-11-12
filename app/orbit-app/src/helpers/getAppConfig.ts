import { allIntegrations } from '../sources'
import { ResolvableModel } from '../sources/types'
import { AppConfig } from '@mcro/stores'
import { sourceToAppConfig } from '../stores/SourcesStore'

export const getAppConfig = (model: ResolvableModel): AppConfig => {
  console.log('get app config', model)
  let type
  switch (model.target) {
    case 'bit':
      type = model.integration
      break
    case 'person-bit':
      type = 'person'
      break
    default:
      throw new Error(
        `Get app config for model.target ${model.target} failed for model: ${JSON.stringify(
          model,
        )}`,
      )
  }
  const app = allIntegrations[type]
  if (!app) {
    console.log('no app', type, allIntegrations)
    return null
  }
  return sourceToAppConfig(app, model)
}
