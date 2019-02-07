import {
  App,
  AppEntity,
  AppType,
  SettingEntity,
  SpaceEntity,
  userDefaultValue,
  UserEntity,
} from '@mcro/models'
import { getRepository, MigrationInterface } from 'typeorm'

export class EnsureModels1546916550168 implements MigrationInterface {
  public async up(): Promise<any> {
    await this.ensureDefaultSetting()
    await this.ensureDefaultSpace()
    await this.ensureDefaultApps()
    await this.ensureDefaultUser()
  }

  private async ensureDefaultSetting() {
    let setting = await getRepository(SettingEntity).findOne({ name: 'general' })

    if (!setting) {
      console.log('Creating initial general setting')
      const settingEntity = new SettingEntity()
      Object.assign(settingEntity, {
        name: 'general',
        values: {},
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
          paneSort: [],
          colors: ['#CACCAC', '#270769'],
        },
        {
          name: 'Me',
          paneSort: [],
          colors: ['#ACEACE', '#D48D48'],
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
              target: 'app',
              name: 'Search',
              type: AppType.search,
              colors: ['green', 'magenta'],
              pinned: true,
              editable: false,
              spaceId: space.id,
              data: {},
            },
            {
              target: 'app',
              name: 'Directory',
              type: AppType.people,
              colors: ['red', 'darkblue'],
              spaceId: space.id,
              pinned: true,
              data: {},
            },
            {
              target: 'app',
              name: 'Home',
              type: AppType.lists,
              spaceId: space.id,
              colors: ['pink', 'orange'],
              data: {
                rootItemID: 0,
                items: {
                  0: {
                    id: 0,
                    name: 'Root',
                    type: 'root',
                    children: [],
                  },
                },
              },
            },
            // {
            //   target: 'app',
            //   name: 'Topics',
            //   type: 'topics',
            //   spaceId: space.id,
            //   data: {},
            // },
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

  private async ensureDefaultUser() {
    const user = await getRepository(UserEntity).findOne({})
    const firstSpace = await getRepository(SpaceEntity).findOne({})

    if (!firstSpace) {
      throw new Error('Should be at least one space...')
    }

    if (!user) {
      await getRepository(UserEntity).save({
        ...userDefaultValue,
        activeSpace: firstSpace.id,
      })
    }
  }

  public async down(): Promise<any> {}
}
