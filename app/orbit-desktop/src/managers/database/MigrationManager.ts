import { Logger } from '@mcro/logger'
import { migrations } from './migrations'

const log = new Logger('MigrationManager')

export class MigrationManager {
  async start() {
    log.info('Running migrations...')
    for (const migration of migrations) {
      for (const name in migration) {
        const { condition, run } = migration[name]
        if (!(await condition())) {
          log.info(`Running migration ${name}`)
          await run()
        }
      }
    }
  }
}
