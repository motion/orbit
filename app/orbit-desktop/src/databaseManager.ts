import sqlite from 'sqlite'
import { DATABASE_PATH } from './constants'
import { logger } from '@mcro/logger'
import { Desktop, Electron, App } from '@mcro/stores'
import { CompositeDisposable } from 'event-kit'
import { remove } from 'fs-extra'
import { sleep } from './helpers'

const log = logger('database')

// we can setup the database for the first time
// and run migration from here

const hasTable = async (db: sqlite.Database, table: string) =>
  await db.get(
    'SELECT name FROM sqlite_master WHERE type="table" AND name=?',
    table,
  )

export class DatabaseManager {
  db: sqlite.Database
  subscriptions = new CompositeDisposable()
  searchIndexListener: ReturnType<typeof Desktop.onMessage>

  async start() {
    this.db = await sqlite.open(DATABASE_PATH)
    this.ensureSearchIndex()
    this.watchForReset()

    this.temporarySearchResults()
  }

  dispose() {
    this.subscriptions.dispose()
    this.searchIndexListener()
  }

  private temporarySearchResults() {
    this.searchIndexListener = Desktop.onMessage(
      Desktop.messages.SEARCH_INDEX,
      async searchString => {
        const all = await this.db.all(
          `
        SELECT id FROM bit_entity JOIN search_index WHERE search_index MATCH ? ORDER BY rank LIMIT 1000
      `,
          searchString,
        )
        const answer = all.map(x => x.id)
        Desktop.sendMessage(
          App,
          App.messages.SEARCH_INDEX_ANSWER,
          JSON.stringify({
            searchString,
            answer,
          }),
        )
      },
    )
  }

  private watchForReset() {
    const dispose = Desktop.onMessage(Desktop.messages.RESET_DATA, async () => {
      log(`Removing all data from database at: ${DATABASE_PATH}`)
      await remove(DATABASE_PATH)
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
  }

  private ensureSearchIndex = async () => {
    if (await hasTable(this.db, 'search_index')) {
      log('Already has search index')
      return
    }
    await this.createSearchIndex()
  }

  removeSearchIndex = async () => {
    log('Setting up search index')
    await this.db.exec('DROP TABLE search_index')
    await this.db.exec('DROP TRIGGER after_bit_insert')
    await this.db.exec('DROP TRIGGER after_bit_update')
    await this.db.exec('DROP TRIGGER after_bit_delete')
  }

  createSearchIndex = async () => {
    log('Setting up search index')
    await this.db.exec(
      `CREATE VIRTUAL TABLE search_index USING fts5(
        title,
        body,
        tokenize=porter
      )`,
    )
    log('Setting up trigger to keep search index up to date')
    // INSERT
    await this.db.exec(
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
    // UPDATE
    await this.db.exec(`
      CREATE TRIGGER after_bit_update UPDATE OF bit ON bit_entity BEGIN
        UPDATE search_index
          SET body = new.body,
              title = new.title
        WHERE rowid = old.rowid;
      END;
    `)
    // DELETE
    await this.db.exec(`
      CREATE TRIGGER after_bit_delete AFTER DELETE ON bit_entity BEGIN
        DELETE FROM search_index WHERE rowid = old.rowid;
      END;
    `)
  }
}
