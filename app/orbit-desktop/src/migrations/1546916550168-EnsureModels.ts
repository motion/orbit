import { MigrationInterface, getRepository } from 'typeorm'
import { SpaceEntity, SettingEntity } from '@mcro/models'

export class EnsureModels1546916550168 implements MigrationInterface {
  public async up(): Promise<any> {
    await this.ensureDefaultSetting()
    await this.ensureDefaultSpace()
  }

  private async ensureDefaultSetting() {
    let setting = await getRepository(SettingEntity).findOne({ name: 'general' })
    if (!setting) {
      console.log('Creating initial general setting')
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
  }

  private async ensureDefaultSpace() {
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
  }

  public async down(): Promise<any> {}
}
