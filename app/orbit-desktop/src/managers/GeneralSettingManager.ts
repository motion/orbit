import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { Setting, SettingEntity } from '@o/models'
import { decorate } from '@o/use-store'
import AutoLaunch from 'auto-launch'
import { getRepository } from 'typeorm'

const Config = getGlobalConfig()
const log = new Logger('GeneralSettingManager')

@decorate
export class GeneralSettingManager {
  autoLaunch: AutoLaunch

  constructor() {
    if (Config.isProd) {
      try {
        const dotApp = Config.paths.dotApp
        console.log('auto launch path', dotApp)
        this.autoLaunch = new AutoLaunch({
          name: 'Orbit',
          path: dotApp,
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  async start() {
    let setting = await getRepository(SettingEntity).findOne({ name: 'general' })
    this.handleAutoLaunch(setting)
  }

  dispose() {}

  handleAutoLaunch = (setting: Setting) => {
    if (!this.autoLaunch) {
      log.verbose('Autolaunch disabled in dev mode')
      return
    }
    const isEnabled = this.autoLaunch.isEnabled()
    const values = setting.values
    if (values.autoLaunch) {
      if (!isEnabled) {
        this.autoLaunch.enable()
      }
    } else {
      if (isEnabled) {
        this.autoLaunch.disable()
      }
    }
  }
}
