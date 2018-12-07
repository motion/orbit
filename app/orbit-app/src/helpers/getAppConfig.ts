import { allIntegrations } from '../sources'
import { ResolvableModel } from '../sources/types'
import { sourceToAppConfig } from '../stores/SourcesStore'
import { AppConfig } from '@mcro/models'

export const getAppConfig = (model: ResolvableModel): AppConfig => {
  let type: string = ''
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
