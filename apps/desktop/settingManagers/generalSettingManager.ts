import { store } from '@mcro/black'
import { modelQueryReaction } from '@mcro/helpers'
import { Setting, findOrCreate } from '@mcro/models'
import AutoLaunch from 'auto-launch'

const generalSettingQuery = { type: 'setting', category: 'general' }

@store
export class GeneralSettingManager {
  autoLaunch = new AutoLaunch({
    name: 'Orbit',
  })

  constructor() {
    findOrCreate(Setting, generalSettingQuery)
  }

  handleSetting = modelQueryReaction(
    () => Setting.findOne(generalSettingQuery),
    (setting: Setting) => {
      this.handleAutoLaunch(setting)
    },
  )

  handleAutoLaunch = setting => {
    if (setting.values.autoLaunch) {
      this.autoLaunch.enable()
    } else {
      this.autoLaunch.disable()
    }
  }
}
