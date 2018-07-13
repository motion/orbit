import { modelQueryReaction } from '@mcro/helpers'
import { Setting, Not, Equal } from '@mcro/models'

export class IntegrationSettingsStore {
  settingsList?: Setting[] = modelQueryReaction(() =>
    Setting.find({
      where: {
        token: Not(Equal('')),
      },
    }),
  )

  get settings() {
    if (!this.settingsList) {
      return null
    }
    return this.settingsList.reduce(
      (acc, cur) => ({ ...acc, [cur.type]: cur }),
      {},
    )
  }
}
