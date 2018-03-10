import * as AllMigrations from './migrations/all'

export default class Migrations {
  async runAll() {
    for (const key of Object.keys(AllMigrations)) {
      const migration = AllMigrations[key]
      if (!await migration.hasRun()) {
        console.log(`Running migration ${key}`)
        await migration.run()
        console.log(`Finished migration ${key}`)
      }
    }
  }
}
