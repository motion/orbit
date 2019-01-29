import { App, AppEntity, SpaceEntity } from '@mcro/models'
import { getRepository, MigrationInterface } from 'typeorm'

export class EnsureModels1546916550169 implements MigrationInterface {
  public async up(): Promise<any> {
    await this.ensureDefaultApps()
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
              type: 'search',
              spaceId: space.id,
              data: {},
            },
            {
              target: 'app',
              name: 'People',
              type: 'people',
              spaceId: space.id,
              data: {},
            },
            {
              target: 'app',
              name: 'Topics',
              type: 'topics',
              spaceId: space.id,
              data: {},
            },
            {
              target: 'app',
              name: 'Memory',
              type: 'lists',
              spaceId: space.id,
              data: {
                rootItemID: 0,
                items: {},
              },
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
