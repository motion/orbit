import { getRepository } from 'typeorm'
import { SettingEntity } from '@mcro/entities'
import { GeneralSetting } from '@mcro/models'

export const generalSetting = {
  type: 'general' as 'general',
  category: 'general',
  name: 'general'
}

export async function getSetting(query) {
  return await getRepository(SettingEntity).findOne(query)
}

export async function getGeneralSetting() {
  return (await getSetting(generalSetting)) as GeneralSetting
}
