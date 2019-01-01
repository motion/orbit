import { getRepository } from '@mcro/mediator/node_modules/typeorm'
import { SettingEntity, Setting } from '@mcro/models'

export async function getSetting() {
  return await getRepository(SettingEntity).findOne({ name: 'general' })
}

export async function getSettingValue<A extends keyof Setting['values']>(key?: A) {
  const setting = await getSetting()
  if (typeof setting.values[key] !== 'undefined') {
    return setting.values[key]
  }
  throw new Error(`No key found on setting: ${key}`)
}

export async function updateSetting(values: Partial<Setting['values']>) {
  const setting = await getSetting()
  setting.values = {
    ...setting.values,
    ...values,
  }
  await getRepository(SettingEntity).save(setting)
}

export async function ensureSetting<A extends keyof Setting['values']>(key: A, value: Setting['values'][A]) {
  if (typeof (await getSettingValue(key)) === 'undefined') {
    await updateSetting({ [key]: value })
  }
}