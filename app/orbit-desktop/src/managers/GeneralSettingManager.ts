import { store } from '@mcro/black'
import { getGlobalConfig } from '@mcro/config'
import { SettingEntity, SpaceEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { Setting } from '@mcro/models'
import AutoLaunch from 'auto-launch'
import { getRepository } from 'typeorm'

const Config = getGlobalConfig()
const log = new Logger('GeneralSettingManager')

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
  }

  async start() {
    let setting = await getRepository(SettingEntity).findOne({ name: 'general' })
    if (!setting) {
      const settingEntity = new SettingEntity()
      Object.assign(settingEntity, {
        name: 'general',
        values: {
          openShortcut: 'Option+Space',
          autoLaunch: true,
          autoUpdate: true,
          darkTheme: true,
        },
      })
      await getRepository(SettingEntity).save(settingEntity)
      setting = await getRepository(SettingEntity).findOne({ name: 'general' })
    }
    let spaces = await getRepository(SpaceEntity).find()
    if (!spaces.length) {
      await getRepository(SpaceEntity).save([
        {
          name: 'Orbit',
          colors: ['blue', 'green'],
        },
        {
          name: 'Me',
          colors: ['red', 'gray'],
        },
        {
          name: 'Discussions',
          colors: ['blue', 'red'],
        },
      ])
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
