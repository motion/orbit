import { Logger } from '@mcro/logger'
import { Person } from '@mcro/models'
import { GmailSettingValues } from '@mcro/models'
import { PersonBitEntity } from '../../entities/PersonBitEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { IntegrationSyncer } from '../core/IntegrationSyncer'

const log = new Logger('syncer:mail-whitelistener')

/**
 * Whitelists emails from person bits.
 */
export class MailWhitelisterSyncer implements IntegrationSyncer {

  async run() {

    // load person because we need emails that we want to whitelist
    log.info(`loading person bits`)
    const personBits = await PersonBitEntity.find({
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
    const integrations = await SettingEntity.find({
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
      await integration.save()
    }
    log.info(`newly whitelisted emails`, newWhiteListedEmails)
  }


}
