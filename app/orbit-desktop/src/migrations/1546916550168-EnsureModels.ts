import { MigrationInterface, getRepository } from 'typeorm'
import { SpaceEntity, SettingEntity, App, AppEntity } from '@mcro/models'

export class EnsureModels1546916550168 implements MigrationInterface {
  public async up(): Promise<any> {
    await this.ensureDefaultSetting()
    await this.ensureDefaultSpace()
    await this.ensureDefaultApps()
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

  private async ensureDefaultApps() {
    const spaces = await getRepository(SpaceEntity).find()

    await Promise.all(
      spaces.map(async space => {
        const apps = await getRepository(AppEntity).find({ spaceId: space.id })
        if (!apps.length) {
          const defaultApps: App[] = [
            {
              name: 'Search',
              type: 'search',
              spaceId: space.id,
              data: {},
            },
          ]
          await Promise.all(
            defaultApps.map(app => {
              return getRepository(AppEntity).save(app)
            }),
          )
        }
      }),
    )
  }

  public async down(): Promise<any> {}
}
