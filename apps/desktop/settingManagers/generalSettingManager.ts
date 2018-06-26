import { store } from '@mcro/black'
import { modelQueryReaction } from '@mcro/helpers'
import { Setting, findOrCreate } from '@mcro/models'
import AutoLaunch from 'auto-launch'
import * as Constants from '~/constants'
import debug from '@mcro/debug'

const log = debug('generalSettingManager')

const generalSettingQuery = { type: 'setting', category: 'general' }

@store
export class GeneralSettingManager {
  constructor() {
    if (Constants.IS_PROD) {
      log(
        'Note, autolaunch froze before, so check if it freezes after this log...',
      )
    }
    findOrCreate(Setting, generalSettingQuery)
  }

  autoLaunch =
    Constants.IS_PROD &&
    new AutoLaunch({
      name: 'Orbit',
    })

  handleSetting = modelQueryReaction(
    () => Setting.findOne(generalSettingQuery),
    (setting: Setting) => {
      log('reacting to setting', setting)
      this.ensureDefaultSettings(setting)
      this.handleAutoLaunch(setting)
    },
  )

  ensureDefaultSettings = async setting => {
    if (Object.keys(setting.values).length) {
      return
    }
    log('New setting, set defaults...')
    setting.values = {
      keyboardShortcut: 'CommandOrControl+Option+Space',
      autoLaunch: true,
    }
    await setting.save()
  }

  handleAutoLaunch = setting => {
    if (!this.autoLaunch) {
      log('Autolaunch disabled in dev mode')
      return
    }
    if (setting.values.autoLaunch) {
      this.autoLaunch.enable()
    } else {
      this.autoLaunch.disable()
    }
  }
}
