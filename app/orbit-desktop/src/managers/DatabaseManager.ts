import { Logger } from '@o/logger'
import { AppBit, AppEntity, Entities, SpaceEntity, userDefaultValue, UserEntity } from '@o/models'
import { Desktop } from '@o/stores'
import { sleep } from '@o/utils'
import { remove } from 'fs-extra'
import { getConnection, getRepository } from 'typeorm'
import { COSAL_DB, DATABASE_PATH } from '../constants'
import connectModels from '../helpers/connectModels'

const log = new Logger('database')

// we can setup the database for the first time
// and run migration from here

export class DatabaseManager {
  searchIndexListener: ReturnType<typeof Desktop.onMessage>

  async start() {
    // connect models next
    log.info('Connecting models...')
    await connectModels(Entities)

    // setup default data
    await this.ensureDefaultSpace()
    await this.ensureDefaultApps()
    await this.ensureDefaultUser()

    await sleep(100)

    log.info('Connected models...')

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
        await sleep(100)
      }
    }

    log.info('Ensure search indices...')
    await this.createSearchIndices()

    // create some custom indices
    log.info('Ensure other indices...')
    await this.createIndices()
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
          const defaultApps: AppBit[] = [
            {
              target: 'app',
              identifier: 'search',
              name: 'Search',
              colors: ['#D48D48', '#ACEACE'],
              tabDisplay: 'permanent',
              spaceId: space.id,
              data: {},
            },
            {
              target: 'app',
              name: 'Directory',
              identifier: 'people',
              colors: ['#0F1453', '#449878'],
              spaceId: space.id,
              tabDisplay: 'pinned',
              data: {},
            },
            {
              target: 'app',
              name: 'Home',
              identifier: 'lists',
              spaceId: space.id,
              colors: ['#353353', '#EADEAD'],
              tabDisplay: 'pinned',
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
}
