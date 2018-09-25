import { PersonEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { PersonUtils } from '@mcro/model-utils'
import { ConfluencePersonData, ConfluenceSettingValues } from '@mcro/models'
import { ConfluenceLoader, ConfluenceUser } from '@mcro/services'
import { hash } from '@mcro/utils'
import { getRepository } from 'typeorm'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
import { createOrUpdatePersonBits } from '../../utils/repository'

const log = new Logger('syncer:confluence:people')

/**
 * Syncs Confluence people.
 */
export class ConfluencePeopleSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: ConfluenceLoader
  private people: PersonEntity[]

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new ConfluenceLoader(setting)
  }

  /**
   * Runs synchronization process.
   */
  async run(): Promise<void> {
    // load users from confluence API
    log.verbose('loading confluence API users')
    const allUsers = await this.loader.loadUsers()
    log.verbose('got confluence API users', allUsers)

    // we don't need some confluence users, like system or bot users
    // so we are filtering them out
    log.verbose('filter out users we don\'t need')
    const filteredUsers = allUsers.filter(member => this.checkUser(member))
    log.verbose('users were filtered out', filteredUsers)

    // load users from the database
    log.verbose('loading database (exist) users')
    this.people = await getRepository(PersonEntity).find({
      settingId: this.setting.id,
    })
    log.verbose('got database users', this.people)

    // create entities for each loaded member
    log.verbose('creating person entities from the loaded content')
    const people = filteredUsers.map(user => this.createPerson(user))
    log.info('entities created', people)

    // saving person entities and person bits
    log.verbose('saving entities', people)
    await getRepository(PersonEntity).save(people)
    await createOrUpdatePersonBits(people)
    log.verbose('entities saved')
  }

  /**
   * Checks if confluence user is acceptable and can be used to create person entity from.
   */
  private checkUser(user: ConfluenceUser): boolean {
    const email = user.details.personal.email || ''
    const ignoredEmail = '@connect.atlassian.com'
    return email.substr(ignoredEmail.length * -1) !== ignoredEmail
  }

  /**
   * Creates person entity from a given confluence user.
   */
  private createPerson(user: ConfluenceUser): PersonEntity {
    const values = this.setting.values as ConfluenceSettingValues
    const domain = values.credentials.domain
    const id = hash(`confluence-${this.setting.id}-${user.accountId}`)
    const person = this.people.find(person => person.id === id)
    const data: ConfluencePersonData = {}

    return Object.assign(
      person || new PersonEntity(),
      PersonUtils.create({
        id,
        integration: 'confluence',
        setting: this.setting,
        integrationId: user.accountId,
        name: user.displayName,
        email: user.details.personal.email,
        photo: domain + user.profilePicture.path.replace('s=48', 's=512'),
        raw: user,
        data,
      }),
    )
  }
}
