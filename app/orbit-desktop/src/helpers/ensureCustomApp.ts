import { SettingEntity } from '../entities/SettingEntity'
import { BitEntity } from '../entities/BitEntity'
import { getRepository } from 'typeorm'
import { Setting } from '@mcro/models'
import { BitUtils } from '../utils/BitUtils'

// temporary while we demo custom apps

export async function ensureCustomApp() {
  const vals: Partial<Setting> = {
    type: 'app1',
    category: 'custom',
    token: 'good',
  }
  let setting = await SettingEntity.findOne(vals)
  if (!setting) {
    setting = await getRepository(SettingEntity).save(Object.assign(new SettingEntity(), vals))
  }
  const bit = BitUtils.create({
    id: 1231023,
    integration: 'app1',
    title: 'My app',
    body: '',
    type: 'custom',
    bitCreatedAt: Date.now(),
    bitUpdatedAt: Date.now(),
    settingId: setting.id,
  })
  if (
    !(await BitEntity.findOne({
      type: 'custom',
      id: 1231023,
      settingId: setting.id,
    }))
  ) {
    await getRepository(BitEntity).save(bit)
  }
}
