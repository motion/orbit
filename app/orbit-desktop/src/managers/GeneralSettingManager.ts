import { store } from '@mcro/black'
import { GeneralSettingValues } from '@mcro/models'
import AutoLaunch from 'auto-launch'
import { SettingEntity } from '@mcro/entities'
import { getRepository } from 'typeorm'
import { Logger } from '@mcro/logger'
import { getGlobalConfig } from '@mcro/config'
import { Desktop } from '@mcro/stores'

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
  offMessages: any

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

    this.offMessages = Desktop.onMessage(Desktop.messages.TOGGLE_SETTING, async val => {
      const setting = await getRepository(SettingEntity).findOne(generalSettingQuery)
      setting.values[val] = !setting.values[val]
      await getRepository(SettingEntity).save(setting)
    })
  }

  async start() {

    const values = generalSettingQuery
    let item = await SettingEntity.findOne({ where: values })
    if (!item) {
      item = new SettingEntity()
      Object.assign(item, values)
      await getRepository(SettingEntity).save(item)
    }

    const setting = await getRepository(SettingEntity).findOne(generalSettingQuery)
    this.ensureDefaultSettings(setting)
    this.handleAutoLaunch(setting)
  }

  dispose() {
    this.offMessages()
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
