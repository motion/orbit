import { connectModels } from '@o/libs-node'
import { Logger } from '@o/logger'
import { Entities, UserEntity } from '@o/models'
import { Desktop } from '@o/stores'
import { sleep } from '@o/utils'
import { remove } from 'fs-extra'
import { getConnection, getRepository } from 'typeorm'

import { COSAL_DB, DATABASE_PATH } from '../constants'
import { migrations } from '../migrations'

const log = new Logger('database')

// we can setup the database for the first time
// and run migration from here

export class DatabaseManager {
  searchIndexListener: ReturnType<typeof Desktop.onMessage>

  async start() {
    // connect models next
    log.verbose('Connecting models...')
    await connectModels({
      name: 'default',
      models: Entities,
      migrations,
      databasePath: DATABASE_PATH,
    })

    // setup default data
    log.verbose('Ensure default user...')
    await this.ensureDefaultUser()

    await sleep(20)

    log.verbose('Connected models...')

    // TODO typeorm needs a patch
    // sql errors happened here if i didnt wait... @nate
    let connected = false
    let tries = 0
    while (!connected) {
      if (tries > 10) {
        throw new Error('Tried ten times to connect to models, no dice...')
      }
      try {
        tries++
        await getRepository(UserEntity).findOne({})
        connected = true
      } catch (err) {
        console.log('got err, migrations may not be done yet...', err)
      } finally {
        await sleep(20)
      }
    }

    log.verbose('Ensure indices...')
    await Promise.all([this.createSearchIndices(), this.createIndices()])
  }

  dispose() {
    this.searchIndexListener()
  }

  async resetAllData() {
    log.info(`Removing all data from database at: ${DATABASE_PATH}`)
    await remove(COSAL_DB)
    await remove(DATABASE_PATH)
  }

  private async createIndices() {
    await getConnection().query(
      'CREATE INDEX IF NOT EXISTS "searchIndex1" ON "bit_entity" ("type", "bitCreatedAt" DESC, "sourceId");',
    )
    await getConnection().query(
      'CREATE INDEX IF NOT EXISTS "searchIndex2" ON "bit_entity" ("type", "bitCreatedAt" DESC, "sourceId", "sourceType");',
    )
    await getConnection().query(
      'CREATE INDEX IF NOT EXISTS "searchIndex3" ON "bit_entity" ("type", "bitCreatedAt" DESC, "sourceId", "locationName");',
    )
    await getConnection().query(
      'CREATE INDEX IF NOT EXISTS "searchIndex4" ON "bit_entity" ("type", "bitCreatedAt" DESC, "sourceId", "sourceType", "locationName");',
    )
  }

  private async createSearchIndices() {
    // check if search index table does not exist yet
    const table = await getConnection().query(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="search_index"',
    )
    if (table.length) return

    // await queryRunner.query('DROP TABLE search_index')
    // await queryRunner.query('DROP TRIGGER after_bit_insert')
    // await queryRunner.query('DROP TRIGGER after_bit_update')
    // await queryRunner.query('DROP TRIGGER after_bit_delete')

    // search index table
    await getConnection().query(
      `CREATE VIRTUAL TABLE search_index USING fts5(
        title,
        body,
        tokenize=porter
      )`,
    )

    // trigger for inserts
    await getConnection().query(
      `CREATE TRIGGER after_bit_insert AFTER INSERT ON bit_entity BEGIN
        INSERT INTO search_index (
          rowid,
          title,
          body
        )
        VALUES(
          new.rowid,
          new.title,
          new.body
        );
      END;
      `,
    )

    // trigger for updates
    await getConnection().query(`
      CREATE TRIGGER after_bit_update UPDATE OF bit ON bit_entity BEGIN
        UPDATE search_index
          SET body = new.body,
              title = new.title
        WHERE rowid = old.rowid;
      END;
    `)

    // trigger for deletes
    await getConnection().query(`
      CREATE TRIGGER after_bit_delete AFTER DELETE ON bit_entity BEGIN
        DELETE FROM search_index WHERE rowid = old.rowid;
      END;
    `)
  }

  removeSearchIndex = async () => {
    log.info('Setting up search index')
    await getConnection().query('DROP TABLE search_index')
    await getConnection().query('DROP TRIGGER after_bit_insert')
    await getConnection().query('DROP TRIGGER after_bit_update')
    await getConnection().query('DROP TRIGGER after_bit_delete')
  }

  private async ensureDefaultUser() {
    const user = await getRepository(UserEntity).findOne({})

    if (!user) {
      await getRepository(UserEntity).save({
        name: 'Me',
        spaceConfig: {},
        appState: {},
        settings: {
          openShortcut: 'Option+Space',
          autoLaunch: true,
          autoUpdate: true,
          theme: 'automatic',
        },
        activeSpace: 0,
      })
    }
  }
}
