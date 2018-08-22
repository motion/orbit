import { logger } from '@mcro/logger'
import { JiraPersonData, Person } from '@mcro/models'
import { getRepository } from 'typeorm'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { createOrUpdatePersonBits } from '../../repository'
import { assign } from '../../utils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { JiraLoader } from './JiraLoader'
import { JiraUser } from './JiraTypes'

const log = logger('syncer:jira:people')

/**
 * Syncs Jira people.
 */
export class JiraPeopleSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: JiraLoader
  private people: PersonEntity[]

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new JiraLoader(setting)
  }

  async run(): Promise<void> {

    // load users from jira API
    log('loading jira API users')
    const allUsers = await this.loader.loadUsers()
    log('got jira API users', allUsers)

    // we don't need some jira users, like system or bot users
    // so we are filtering them out
    log('filter out users we don\'t need')
    const filteredUsers = allUsers.filter(user => this.checkUser(user))
    log('users were filtered out', filteredUsers)

    // load users from the database
    log('loading database (exist) users')
    this.people = await getRepository(PersonEntity).find({
      settingId: this.setting.id,
    })
    log('got database users', this.people)

    // create entities for each loaded user
    log('creating person entities from the loaded content')
    const people = filteredUsers.map(user => this.createPerson(user))
    log('entities created', people)

    // saving person entities and person bits
    log('saving entities', people)
    await getRepository(PersonEntity).save(people)
    await createOrUpdatePersonBits(people)
    log('entities saved')
  }

  /**
   * Checks if confluence user is acceptable and can be used to create person entity from.
   */
  private checkUser(user: JiraUser): boolean {
    const email = user.emailAddress || ''
    const ignoredEmail = '@connect.atlassian.com'
    return email.substr(ignoredEmail.length * -1) !== ignoredEmail
  }

  /**
   * Creates person entity from a given confluence user.
   */
  private createPerson(user: JiraUser): PersonEntity {
    const id = `jira-${this.setting.id}-${user.accountId}`
    const person = this.people.find(person => person.id === id)
    const data: JiraPersonData = {}
    return assign(person || new PersonEntity(), {
      id,
      integration: 'jira',
      setting: this.setting,
      integrationId: user.accountId,
      name: user.displayName,
      email: user.emailAddress,
      photo: user.avatarUrls['48x48'],
      data,
    })
  }

}
