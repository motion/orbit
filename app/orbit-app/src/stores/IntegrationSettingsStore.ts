import { Setting } from '@mcro/models'
import { SettingRepository } from '../repositories'
import { modelQueryReaction } from '../repositories/modelQueryReaction'
import { getSettingTitle } from '../helpers/settingToResult'

export class IntegrationSettingsStore {
  settingsList?: Setting[] = modelQueryReaction(() =>
    SettingRepository.find({
      where: {
        token: { $not: '' },
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

  getTitle = getSettingTitle
}
