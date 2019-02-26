import { Logger } from '@mcro/logger'
import { BitEntity, GmailSourceValues, SourceEntity } from '@mcro/models'
import { getRepository } from 'typeorm'
import { SourceSyncer } from '../../core/SourceSyncer'

/**
 * Whitelists emails from person bits.
 */
export class MailWhitelisterSyncer implements SourceSyncer {
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
        sourceType: ['slack', 'github', 'drive', 'jira', 'confluence']
      },
    })
    this.log.info('person bits were loaded', people)
    const emails = people.map(person => person.email).filter(email => email.indexOf('@') !== -1)
    this.log.info('emails from the person bits', emails)

    // next we find all gmail Sources to add those emails to their whitelists
    this.log.info('loading gmail Sources')
    const Sources = await getRepository(SourceEntity).find({
      where: { type: 'gmail' },
    })
    this.log.info('loaded gmail Sources', Sources)

    // update whitelist settings in Sources
    const newWhiteListedEmails: string[] = []
    for (let Source of Sources) {
      const values = Source.values as GmailSourceValues
      const foundEmails = values.foundEmails || []
      const whitelist = {}
      for (let email of emails) {
        if (foundEmails.indexOf(email) === -1) {
          whitelist[email] = true
          newWhiteListedEmails.push(email)
        }
      }
      values.whitelist = whitelist
      await getRepository(SourceEntity).save(Source)
    }
    this.log.info('newly whitelisted emails', newWhiteListedEmails)
  }
}
