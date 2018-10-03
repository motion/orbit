import { PersonBitEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { GmailSettingValues } from '@mcro/models'
import { getRepository } from 'typeorm'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'

/**
 * Whitelists emails from person bits.
 */
export class MailWhitelisterSyncer implements IntegrationSyncer {
  private log: Logger

  constructor() {
    this.log = new Logger('syncer:mail-whitelistener')
  }

  /**
   * Runs synchronization process.
   */
  async run() {
    // load person because we need emails that we want to whitelist
    this.log.info(`loading person bits`)
    const personBits = await getRepository(PersonBitEntity).find({
      where: [
        { hasSlack: true },
        { hasGithub: true },
        { hasGdrive: true },
        { hasJira: true },
        { hasConfluence: true },
        // { hasGmail: true },
      ],
    })
    this.log.info('person bits were loaded', personBits)
    const emails = personBits
      .map(person => person.email)
      .filter(email => email.indexOf('@') !== -1)
    this.log.info('emails from the person bits', emails)

    // next we find all gmail integrations to add those emails to their whitelists
    this.log.info('loading gmail integrations')
    const integrations = await getRepository(SettingEntity).find({
      where: { type: 'gmail' },
    })
    this.log.info('loaded gmail integrations', integrations)

    // update whitelist settings in integrations
    const newWhiteListedEmails: string[] = []
    for (let integration of integrations) {
      const values = integration.values as GmailSettingValues
      const foundEmails = values.foundEmails || []
      const whitelist = { }
      for (let email of emails) {
        if (foundEmails.indexOf(email) === -1) {
          whitelist[email] = true
          newWhiteListedEmails.push(email)
        }
      }
      values.whitelist = whitelist
      await getRepository(SettingEntity).save(integration)
    }
    this.log.info('newly whitelisted emails', newWhiteListedEmails)
  }

}
