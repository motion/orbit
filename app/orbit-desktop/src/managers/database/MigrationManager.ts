import { Logger } from '@mcro/logger'
import { migrations } from './migrations'

const log = new Logger('MigrationManager')

export class MigrationManager {
  async start() {
    log.verbose('Starting migration manager...')
    for (const { name, condition, run } of migrations) {
      if (!(await condition())) {
        log.info(`Running migration ${name}`)
        await run()
      }
    }
  }
}
