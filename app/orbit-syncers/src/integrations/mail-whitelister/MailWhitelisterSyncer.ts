import { PersonBitEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { GmailSettingValues } from '@mcro/models'
import { getRepository } from 'typeorm'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'

const log = new Logger('syncer:mail-whitelistener')

/**
 * Whitelists emails from person bits.
 */
export class MailWhitelisterSyncer implements IntegrationSyncer {

  async run() {

    // load person because we need emails that we want to whitelist
    log.info(`loading person bits`)
    const personBits = await getRepository(PersonBitEntity).find({
      where: [
        { hasSlack: true },
        { hasGithub: true },
        { hasGdrive: true },
        { hasJira: true },
        { hasConfluence: true },
        // { hasGmail: true },
      ]
    })
    log.info(`person bits were loaded`, personBits)
    const emails = personBits.map(person => person.email)
    log.info(`emails from the person bits`, emails)

    // next we find all gmail integrations to add those emails to their whitelists
    log.info(`loading gmail integrations`)
    const integrations = await getRepository(SettingEntity).find({
      where: { type: 'gmail' }
    })
    log.info(`loaded gmail integrations`, integrations)

    // update whitelist settings in integrations
    const newWhiteListedEmails: string[] = []
    for (let integration of integrations) {
      const values = integration.values as GmailSettingValues
      const currentWhitelist = values.whiteList || {}
      for (let email of emails) {
        if (currentWhitelist[email] === undefined) {
          currentWhitelist[email] = true
          newWhiteListedEmails.push(email)
        }
      }
      values.whiteList = currentWhitelist
      await getRepository(SettingEntity).save(integration)
    }
    log.info(`newly whitelisted emails`, newWhiteListedEmails)
  }


}
