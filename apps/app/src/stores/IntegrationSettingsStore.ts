import { modelQueryReaction } from '@mcro/helpers'
import { Setting, Not, Equal } from '@mcro/models'

export class IntegrationSettingsStore {
  settings = modelQueryReaction(
    () =>
      Setting.find({
        where: {
          token: Not(Equal('')),
        },
      }),
    settings =>
      settings.reduce((acc, cur) => ({ ...acc, [cur.type]: cur }), {}),
  )
}
