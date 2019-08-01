import { UserEntity } from '@o/models'
import { Desktop } from '@o/stores'
import Fs from 'fs-extra'
import Os from 'os'
import Path from 'path'
import sqlite from 'sqlite'
import { getRepository } from 'typeorm'

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

const sourcePatterns = [
  { name: 'atlassian', patterns: ['%atlassian.net%'] },
  { name: 'github', patterns: ['%github.com%'] },
  { name: 'gmail', patterns: ['%gmail.com%', '%mail.google.com/mail%'] },
  { name: 'slack', patterns: ['%.slack.com%'] },
  { name: 'drive', patterns: ['%docs.google.com%'] },
]

export class OnboardManager {
  history = []
  foundSources = null

  async start() {
    const user = await getRepository(UserEntity).findOne({})
    if (!user.settings.hasOnboarded) {
      this.scanHistory()
    }
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
    console.log('Scanning chrome db for source sites...')
    // first copy it so it's not getting locked by active chrome
    // @ts-ignore it has wrong types
    await Fs.copyFile(dbPath, tmpDbPath)
    const db = await sqlite.open(tmpDbPath)
    const foundSources = {}
    for (const { name, patterns } of sourcePatterns) {
      for (const pattern of patterns) {
        const found = await this.getTopUrlsLike(db, pattern)
        if (found) {
          foundSources[name] = foundSources[name] || []
          foundSources[name].push(found)
        }
      }
    }
    await Fs.remove(tmpDbPath)
    this.foundSources = foundSources
    Desktop.setState({
      onboardState: {
        foundSources,
      },
    })
  }
}
