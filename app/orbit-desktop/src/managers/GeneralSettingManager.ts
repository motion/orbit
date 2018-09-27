import { store } from '@mcro/black'
import { GeneralSettingValues } from '@mcro/models'
import AutoLaunch from 'auto-launch'
import { SettingEntity } from '@mcro/entities'
import { getRepository } from 'typeorm'
import { Logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { generalSetting, getGeneralSetting } from '../helpers/getSetting'

const Config = getGlobalConfig()
const log = new Logger('GeneralSettingManager')

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
    let setting = await getGeneralSetting()
    if (!setting) {
      const settingEntity = new SettingEntity()
      Object.assign(settingEntity, generalSetting)
      await getRepository(SettingEntity).save(settingEntity)
      setting = await getGeneralSetting()
    }
    this.ensureDefaultSettings(setting)
    this.handleAutoLaunch(setting)
  }

  dispose() {}

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
    await getRepository(SettingEntity).save(setting)
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
