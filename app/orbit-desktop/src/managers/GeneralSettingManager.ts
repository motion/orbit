import { store } from '@mcro/black'
import { GeneralSettingValues } from '@mcro/models'
import AutoLaunch from 'auto-launch'
import { SettingEntity } from '../entities/SettingEntity'
import { findOrCreate } from '../helpers/helpers'
import { Logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'

const Config = getGlobalConfig()
const log = new Logger('GeneralSettingManager')

const generalSettingQuery = {
  type: 'general' as 'general',
  category: 'general',
}

// @ts-ignore
@store
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
    log.info('move me to migration plz')
    this.start()
  }

  async start() {
    await findOrCreate(SettingEntity, generalSettingQuery)
    const setting = await SettingEntity.findOne(generalSettingQuery)
    this.ensureDefaultSettings(setting)
    this.handleAutoLaunch(setting)
  }

  ensureDefaultSettings = async setting => {
    const values = setting.values as GeneralSettingValues
    if (Object.keys(values).length) {
      return
    }
    log.info('New setting, set defaults...')
    setting.values = {
      openShortcut: 'Option+Space',
      autoLaunch: true,
      autoUpdate: true,
      darkTheme: true,
    } as GeneralSettingValues
    await setting.save()
  }

  handleAutoLaunch = setting => {
    if (!this.autoLaunch) {
      log.verbose('Autolaunch disabled in dev mode')
      return
    }
    const isEnabled = this.autoLaunch.isEnabled()
    const values = setting.values as GeneralSettingValues
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
