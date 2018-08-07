import { store } from '@mcro/black'
import AutoLaunch from 'auto-launch'
import { SettingEntity } from '../entities/SettingEntity'
import { findOrCreate } from '../helpers/helpers'
import { logger } from '@mcro/logger'
import { getConfig } from '../config'

const Config = getConfig()
const log = logger('GeneralSettingManager')

const generalSettingQuery = { type: 'general', category: 'general' }

// @ts-ignore
@store
export class GeneralSettingManager {
  constructor() {
    if (Config.env.prod) {
      log(
        'Note, autolaunch froze before, so check if it freezes after this log...',
      )
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

  autoLaunch =
    Config.env.prod &&
    new AutoLaunch({
      name: 'Orbit',
    })

  ensureDefaultSettings = async setting => {
    if (Object.keys(setting.values).length) {
      return
    }
    log('New setting, set defaults...')
    setting.values = {
      openShortcut: 'Option+Space',
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
