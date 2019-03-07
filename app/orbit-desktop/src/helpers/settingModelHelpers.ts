import { Setting, SettingEntity } from '@o/models'
import { getRepository } from 'typeorm'

export async function getSetting() {
  return await getRepository(SettingEntity).findOne({ name: 'general' })
}

class SettingValueError extends Error {}

export async function getSettingValue<A extends keyof Setting['values']>(key?: A) {
  const setting = await getSetting()
  if (!setting) {
    throw new SettingValueError('No setting!')
  }
  if (typeof setting.values[key] !== 'undefined') {
    return setting.values[key]
  }
  throw new SettingValueError(`No key found on setting: ${key}`)
}

export async function updateSetting(values: Partial<Setting['values']>) {
  const setting = await getSetting()
  setting.values = {
    ...setting.values,
    ...values,
  }
  await getRepository(SettingEntity).save(setting)
}

export async function ensureSetting<A extends keyof Setting['values']>(
  key: A,
  value: Setting['values'][A],
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
