import sqlite from 'sqlite'
import { DATABASE_PATH } from './constants'
import { logger } from '@mcro/logger'
import { Desktop, Electron, App } from '@mcro/stores'
import { CompositeDisposable } from 'event-kit'
import { remove } from 'fs-extra'

const log = logger('database')

// we can setup the database for the first time
// and run migration from here

const hasTable = (db: sqlite.Database, table: string) =>
  db.all(
    'SELECT name FROM sqlite_master WHERE type=\'table\' AND name=\'{?}\';',
    table,
  )

export class DatabaseManager {
  db: sqlite.Database
  subscriptions = new CompositeDisposable()

  async start() {
    this.db = await sqlite.open(DATABASE_PATH)
    this.ensureSearchTable()
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
        JSON.stringify({ title: 'Deleted successfully!' }),
      )
    })
    this.subscriptions.add({ dispose })
  }

  private ensureSearchTable = async () => {
    if (await hasTable(this.db, 'search_index')) {
      log('Already has search index')
      return
    }
    log('Setting up search index')
    await this.db.all(
      'CREATE VIRTUAL TABLE search_index USING fts5(title, body, location, tokenize=porter);',
    )
    log('Setting up trigger to keep search index up to date')
    // INSERT
    await this.db.all(
      `CREATE TRIGGER after_bit_insert AFTER INSERT ON bits BEGIN
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
      CREATE TRIGGER after_bit_update UPDATE OF bit ON bits BEGIN
        UPDATE search_index
          SET body = new.body
        WHERE rowid = old.id;
      END;
    `)
    // DELETE
    await this.db.all(`
      CREATE TRIGGER after_bit_delete AFTER DELETE ON bits BEGIN
        DELETE FROM search_index WHERE rowid = old.id;
      END;
    `)
  }
}
