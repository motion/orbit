import { store } from '@mcro/black'
import AutoLaunch from 'auto-launch'
import { SettingEntity } from '@mcro/entities'
import { getRepository } from 'typeorm'
import { Logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { Setting } from '@mcro/models'

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

  defaultSettingValues = {
    openShortcut: 'Option+Space',
    autoLaunch: true,
    autoUpdate: true,
    darkTheme: true,
  } as Setting['values']

  async start() {
    let setting = await getRepository(SettingEntity).findOne()
    if (!setting) {
      const settingEntity = new SettingEntity()
      Object.assign(settingEntity, { values: this.defaultSettingValues })
      await getRepository(SettingEntity).save(settingEntity)
      setting = await getRepository(SettingEntity).findOne()
    }
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
