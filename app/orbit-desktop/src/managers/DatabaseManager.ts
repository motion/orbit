import { getConnection } from 'typeorm'
import { DATABASE_PATH, COSAL_DB } from '../constants'
import { Logger } from '@mcro/logger'
import { Desktop, Electron, App } from '@mcro/stores'
import { CompositeDisposable } from 'event-kit'
import { remove } from 'fs-extra'
import { sleep } from '../helpers'
import { ensureCustomApp } from '../helpers/ensureCustomApp'
import connectModels from '../helpers/connectModels'
import { Entities } from '@mcro/entities'

const log = new Logger('database')

// we can setup the database for the first time
// and run migration from here

export class DatabaseManager {
  subscriptions = new CompositeDisposable()
  searchIndexListener: ReturnType<typeof Desktop.onMessage>

  async start() {
    // connect models next
    await connectModels(Entities)

    const table = await getConnection().query(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="search_index"',
    )
    if (table.length === 0) {
      await this.createSearchIndices()
    }

    // watch for reset all data command
    const dispose = Desktop.onMessage(Desktop.messages.RESET_DATA, async () => {
      await this.resetAllData()
      Desktop.sendMessage(
        App,
        App.messages.NOTIFICATION,
        JSON.stringify({
          title: 'Deleted successfully!',
          message: 'Restarting...',
        }),
      )
      await sleep(500)
      Desktop.sendMessage(Electron, Electron.messages.RESTART)
    })
    this.subscriptions.add({ dispose })

    // then do some setup
    await ensureCustomApp()
  }

  dispose() {
    this.subscriptions.dispose()
    this.searchIndexListener()
  }

  private async createSearchIndices() {
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

  private async resetAllData() {
    log.info(`Removing all data from database at: ${DATABASE_PATH}`)
    await remove(COSAL_DB)
    await remove(DATABASE_PATH)
  }

  removeSearchIndex = async () => {
    log.info('Setting up search index')
    await getConnection().query('DROP TABLE search_index')
    await getConnection().query('DROP TRIGGER after_bit_insert')
    await getConnection().query('DROP TRIGGER after_bit_update')
    await getConnection().query('DROP TRIGGER after_bit_delete')
  }
}
