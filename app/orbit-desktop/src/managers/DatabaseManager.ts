import sqlite from 'sqlite'
import { DATABASE_PATH } from '../constants'
import { Logger } from '@mcro/logger'
import { Desktop, Electron, App } from '@mcro/stores'
import { CompositeDisposable } from 'event-kit'
import { remove } from 'fs-extra'
import { sleep } from '../helpers'
import { SettingEntity } from '../entities/SettingEntity'
import { BitEntity } from '../entities/BitEntity'
import { getRepository } from 'typeorm'
import { Bit, Setting } from '@mcro/models'
import { BitUtils } from '../utils/BitUtils'

const log = new Logger('database')

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
    this.ensureCustomApp()

    this.temporarySearchResults()
  }

  dispose() {
    this.subscriptions.dispose()
    this.searchIndexListener()
  }

  async ensureCustomApp() {
    console.log('ensuring custom app...')
    const vals: Partial<Setting> = {
      type: 'app1',
      category: 'custom',
      token: 'good',
    }
    let setting = await SettingEntity.findOne(vals)
    if (!setting) {
      setting = Object.assign(new SettingEntity(), vals)
      await getRepository(SettingEntity).save(setting)
    }
    const bit = BitUtils.create({
      id: '1231023',
      integration: 'app1',
      title: 'My app',
      body: '',
      type: 'custom',
      bitCreatedAt: Date.now(),
      bitUpdatedAt: Date.now(),
      settingId: vals.id
    })
    if (!(await BitEntity.findOne({ type: 'custom', id: '1231023', settingId: vals.id }))) {
      await getRepository(BitEntity).save(bit)
    }
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
      log.info(`Removing all data from database at: ${DATABASE_PATH}`)
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
      log.info('Already has search index')
      return
    }
    await this.createSearchIndex()
  }

  removeSearchIndex = async () => {
    log.info('Setting up search index')
    await this.db.exec('DROP TABLE search_index')
    await this.db.exec('DROP TRIGGER after_bit_insert')
    await this.db.exec('DROP TRIGGER after_bit_update')
    await this.db.exec('DROP TRIGGER after_bit_delete')
  }

  createSearchIndex = async () => {
    log.info('Setting up search index')
    await this.db.exec(
      `CREATE VIRTUAL TABLE search_index USING fts5(
        title,
        body,
        tokenize=porter
      )`,
    )
    log.info('Setting up trigger to keep search index up to date')
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
