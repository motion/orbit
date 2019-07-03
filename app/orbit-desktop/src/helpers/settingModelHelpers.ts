import { Logger } from '@o/logger'
import { User, UserEntity } from '@o/models'
import { getRepository } from 'typeorm'

const log = new Logger('settingModelHelpers')

export async function getUser() {
  return await getRepository(UserEntity).findOne({})
}

class SettingValueError extends Error {}

export async function getSettingValue<A extends keyof User['settings']>(key?: A) {
  const user = await getUser()
  if (!user) {
    throw new SettingValueError('No setting!')
  }
  if (typeof user.settings[key] !== 'undefined') {
    return user.settings[key]
  }
  throw new SettingValueError(`No key found on setting: ${key}`)
}

export async function updateSetting(next: Partial<User['settings']>) {
  const user = await getUser()
  const nextSettings = {
    ...user.settings,
    ...next,
  }
  if (JSON.stringify(user.settings) !== JSON.stringify(nextSettings)) {
    log.info(`Updating user settings ${Object.keys(next)}`)
    user.settings = nextSettings
    await getRepository(UserEntity).save(user)
  }
}

export async function ensureSetting<A extends keyof User['settings']>(
  key: A,
  value: User['settings'][A],
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
