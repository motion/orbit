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

  async start() {
    this.db = await sqlite.open(DATABASE_PATH)
    this.ensureSearchIndex()
    this.watchForReset()
  }

  dispose() {
    this.subscriptions.dispose()
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
    await this.createSearchIndexTriggers()
  }

  createSearchIndex = async () => {
    log('Setting up search index')
    await this.db.all(
      'CREATE VIRTUAL TABLE search_index USING fts5(title, body, location, tokenize=porter);',
    )
  }

  createSearchIndexTriggers = async () => {
    log('Setting up trigger to keep search index up to date')
    // INSERT
    await this.db.all(
      `CREATE TRIGGER after_bit_insert AFTER INSERT ON bit_entity BEGIN
        INSERT INTO search_index (
          rowid,
          title,
          body,
          location
        )
        VALUES(
          new.id,
          new.title,
          new.body,
          new.location
        );
      END;
      `,
    )
    // UPDATE
    await this.db.all(`
      CREATE TRIGGER after_bit_update UPDATE OF bit ON bit_entity BEGIN
        UPDATE search_index
          SET body = new.body
        WHERE rowid = old.id;
      END;
    `)
    // DELETE
    await this.db.all(`
      CREATE TRIGGER after_bit_delete AFTER DELETE ON bit_entity BEGIN
        DELETE FROM search_index WHERE rowid = old.id;
      END;
    `)
  }
}
