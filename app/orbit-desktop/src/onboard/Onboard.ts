import { SettingEntity } from '../entities/SettingEntity'
import sqlite from 'sqlite'
import Fs from 'fs-extra'
import Path from 'path'
import Os from 'os'

const CHROME_DB_PATHS = [
  Path.join(
    Os.homedir(),
    'Library',
    'Application Support',
    'Google',
    'Chrome',
    'Default',
    'History',
  ),
]
const TMP_DB_PATH = Path.join('/tmp', `db-${Math.random()}`.replace('.', ''))

export class Onboard {
  generalSetting: SettingEntity
  history = []

  constructor() {
    this.start()
  }

  async start() {
    this.generalSetting = await SettingEntity.findOne({
      type: 'general',
      category: 'general',
    })
    console.log('onboard:', this.generalSetting)
    // for now always run...
    this.generalSetting.values.hasOnboarded = false
    if (!this.generalSetting.values.hasOnboarded) {
      const didRun = await this.runOnboarding()
      if (didRun) {
        this.generalSetting.values.hasOnboarded = true
        await this.generalSetting.save()
      }
    }
  }

  async runOnboarding() {
    await this.scanHistory()
  }

  scanHistory() {
    const chromeFolder = CHROME_DB_PATHS.find(x => Fs.existsSync(x))
    if (chromeFolder) {
      this.scanChrome(chromeFolder)
    }
  }

  async scanChrome(dbPath: string) {
    console.log('Scanning chrome db for integration sites...')
    // first copy it so it's not getting locked by active chrome
    Fs.copyFileSync(dbPath, TMP_DB_PATH)
    const db = await sqlite.open(TMP_DB_PATH)
    const urls = await db.all(
      `SELECT datetime(last_visit_time/1000000-11644473600, "unixepoch") as last_visited, url, title, visit_count
        WHERE url like "%confluence%"
        FROM urls
        ORDER BY visit_count desc
        LIMIT 10;`,
    )
    console.log('got urls', urls)
  }
}
