import { Logger } from '@mcro/logger'
import { AppEntity, BitEntity } from '@mcro/models'
import { GmailAppData } from '@mcro/models/_/interfaces/app-data/GmailAppData'
import { getRepository } from 'typeorm'
import { AppSyncer } from '../../core/AppSyncer'

/**
 * Whitelists emails from person bits.
 */
export class MailWhitelisterSyncer implements AppSyncer {
  private log: Logger

  constructor() {
    this.log = new Logger('syncer:mail-whitelistener')
  }

  /**
   * Runs synchronization process.
   */
  async run() {
    // load person because we need emails that we want to whitelist
    this.log.info('loading person bits')
    const people = await getRepository(BitEntity).find({
      where: {
        type: 'person',
        appType: ['AppIdentifier', 'github', 'drive', 'jira', 'confluence'],
      },
    })
    this.log.info('person bits were loaded', people)
    const emails = people.map(person => person.email).filter(email => email.indexOf('@') !== -1)
    this.log.info('emails from the person bits', emails)

    // next we find all gmail Apps to add those emails to their whitelists
    this.log.info('loading gmail Apps')
    const Apps = await getRepository(AppEntity).find({
      where: { appType: 'gmail' },
    })
    this.log.info('loaded gmail Apps', Apps)

    // update whitelist settings in Apps
    const newWhiteListedEmails: string[] = []
    for (let App of Apps) {
      const values = App.data.values as GmailAppData['values']
      const foundEmails = values.foundEmails || []
      const whitelist = {}
      for (let email of emails) {
        if (foundEmails.indexOf(email) === -1) {
          whitelist[email] = true
          newWhiteListedEmails.push(email)
        }
      }
      values.whitelist = whitelist
      await getRepository(AppEntity).save(App)
    }
    this.log.info('newly whitelisted emails', newWhiteListedEmails)
  }
}
