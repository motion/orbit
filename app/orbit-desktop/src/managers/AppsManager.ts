import { AppEntity, App } from '@mcro/models'
import { getRepository } from '@mcro/mediator/node_modules/typeorm'

export class AppsManager {
  apps: AppEntity[] = null

  async start() {
    this.apps = await getRepository(AppEntity).find()
    if (!this.apps.length) {
      await this.createDefaultApps()
    }
  }

  async createDefaultApps() {
    const defaultApps: App[] = [
      {
        name: 'Search',
        type: 'search',
        data: {},
      },
    ]
    await Promise.all(
      defaultApps.map(app => {
        return getRepository(AppEntity).save(app)
      }),
    )
  }
}
