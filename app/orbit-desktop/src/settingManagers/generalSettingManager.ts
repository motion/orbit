import { store } from '@mcro/black'
import AutoLaunch from 'auto-launch'
import { SettingEntity } from '../entities/SettingEntity'
import { findOrCreate } from '../helpers/helpers'
import { logger } from '@mcro/logger'
import * as Path from 'path'
import { getGlobalConfig } from '@mcro/config'

const Config = getGlobalConfig()
const log = logger('GeneralSettingManager')

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
    console.log('ensuring models are in place all over, remove me plz')
    this.start()
  }

  async start() {
    await findOrCreate(SettingEntity, generalSettingQuery)
    const setting = await SettingEntity.findOne(generalSettingQuery)
    this.ensureDefaultSettings(setting)
    this.handleAutoLaunch(setting)
  }

  ensureDefaultSettings = async setting => {
    if (Object.keys(setting.values).length) {
      return
    }
    log('New setting, set defaults...')
    setting.values = {
      openShortcut: 'Option+Space',
      autoLaunch: true,
      autoUpdate: true,
      darkTheme: true,
    }
    await setting.save()
  }

  handleAutoLaunch = setting => {
    if (!this.autoLaunch) {
      log('Autolaunch disabled in dev mode')
      return
    }
    const isEnabled = this.autoLaunch.isEnabled()
    if (setting.values.autoLaunch) {
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
