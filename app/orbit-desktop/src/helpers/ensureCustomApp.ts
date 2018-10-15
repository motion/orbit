import { BitEntity, SettingEntity } from '@mcro/entities'
import { Bit, Setting } from '@mcro/models'
import { BitUtils } from '@mcro/model-utils'
import { hash } from '@mcro/utils'
import { getRepository } from 'typeorm'

// temporary while we figure out custom apps

export async function ensureCustomApp() {
  if (process.env.NODE_ENV !== 'development') {
    console.log('no custom app in prod')
    return
  }
  const vals: Partial<Setting> = {
    type: 'app1',
    category: 'custom',
    token: 'good',
  }
  let setting = await SettingEntity.findOne(vals)
  if (!setting) {
    setting = await getRepository(SettingEntity).save(Object.assign(new SettingEntity(), vals, { name: 'custom' }))
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
    !(await getRepository(BitEntity).findOne({
      type: 'custom',
      id: 1231023,
      settingId: setting.id,
    }))
  ) {
    await getRepository(BitEntity).save(bit)
  }
}
