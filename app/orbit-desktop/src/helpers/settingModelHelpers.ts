import { Logger } from '@o/logger'
import { Setting, SettingEntity } from '@o/models'
import { getRepository } from 'typeorm'

const log = new Logger('settingModelHelpers')

export async function getSetting() {
  return await getRepository(SettingEntity).findOne({})
}

class SettingValueError extends Error {}

export async function getSettingValue<A extends keyof Setting['value']>(key?: A) {
  const setting = await getSetting()
  if (!setting) {
    throw new SettingValueError('No setting!')
  }
  if (typeof setting.value[key] !== 'undefined') {
    return setting.value[key]
  }
  throw new SettingValueError(`No key found on setting: ${key}`)
}

export async function updateSetting(next: Partial<Setting['value']>) {
  const setting = await getSetting()
  const nextValue = {
    ...setting.value,
    ...next,
  }
  if (JSON.stringify(setting.value) !== JSON.stringify(nextValue)) {
    log.info(`Updating setting value ${Object.keys(next)}`)
    setting.value = nextValue
    await getRepository(SettingEntity).save(setting)
  }
}

export async function ensureSetting<A extends keyof Setting['value']>(
  key: A,
  value: Setting['value'][A],
) {
  try {
    await getSettingValue(key)
  } catch (err) {
    if (err instanceof SettingValueError) {
      await updateSetting({ [key]: value })
    } else {
      throw err
    }
  }
}
