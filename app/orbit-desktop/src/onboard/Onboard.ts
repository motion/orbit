import { SettingEntity } from '../entities/SettingEntity'
import sqlite from 'sqlite'
import Fs from 'fs-extra'
import Path from 'path'
import Os from 'os'
import { Desktop } from '@mcro/stores'
import { findOrCreate } from '../helpers/helpers'
import { PortForwardStore } from './PortForwardStore'

const chromeDbPaths = [
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
const tmpDbPath = Path.join('/tmp', `db-${Math.random()}`.replace('.', ''))

const integrationPatterns = [
  { name: 'atlassian', patterns: ['%atlassian.net%'] },
  { name: 'github', patterns: ['%github.com%'] },
  { name: 'gmail', patterns: ['%gmail.com%', '%mail.google.com/mail%'] },
  { name: 'slack', patterns: ['%.slack.com%'] },
  { name: 'gdocs', patterns: ['%docs.google.com%'] },
]

export class Onboard {
  generalSetting: SettingEntity
  history = []
  foundIntegrations = null
  portForwardStore = new PortForwardStore()

  constructor() {
    this.start()
  }

  async start() {
    this.generalSetting = await findOrCreate(SettingEntity, {
      type: 'general',
      category: 'general',
    })
    console.log('onboard:', this.generalSetting)
    // for now always run...
    this.generalSetting.values.hasOnboarded = false
    if (!this.generalSetting.values.hasOnboarded) {
      await this.runOnboarding()
      // if (didRun) {
      //   this.generalSetting.values.hasOnboarded = true
      //   await this.generalSetting.save()
      // }
    }
  }

  async runOnboarding() {
    this.scanHistory()
  }

  async scanHistory() {
    const chromeFolder = chromeDbPaths.find(x => Fs.existsSync(x))
    if (chromeFolder) {
      await this.scanChrome(chromeFolder)
    }
  }

  getTopUrlsLike = async (db, pattern) => {
    return await db.all(
      `SELECT datetime(last_visit_time/1000000-11644473600, "unixepoch") as last_visited, url, title, visit_count
        FROM urls
        WHERE url like ?
        ORDER BY visit_count desc
        LIMIT 10;`,
      pattern,
    )
  }

  async scanChrome(dbPath: string) {
    console.log('Scanning chrome db for integration sites...')
    // first copy it so it's not getting locked by active chrome
    // @ts-ignore it has wrong types
    await Fs.copyFile(dbPath, tmpDbPath)

    const db = await sqlite.open(tmpDbPath)
    const foundIntegrations = {}

    for (const { name, patterns } of integrationPatterns) {
      for (const pattern of patterns) {
        const found = await this.getTopUrlsLike(db, pattern)
        if (found) {
          foundIntegrations[name] = foundIntegrations[name] || []
          foundIntegrations[name].push(found)
        }
      }
    }

    await Fs.remove(tmpDbPath)

    this.foundIntegrations = foundIntegrations

    Desktop.setState({
      onboardState: {
        foundIntegrations,
      },
    })
  }
}
