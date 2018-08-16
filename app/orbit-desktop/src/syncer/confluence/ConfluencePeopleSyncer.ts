import { logger } from '@mcro/logger'
import { Bit, Person } from '@mcro/models'
import { AtlassianService } from '@mcro/services'
import { getRepository } from 'typeorm'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { createOrUpdatePersonBit } from '../../repository'
import { assign } from '../../utils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { ConfluenceLoader } from './ConfluenceLoader'
import { ConfluenceUser } from './ConfluenceTypes'

const log = logger('syncer:confluence:people')

export class ConfluencePeopleSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: ConfluenceLoader

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new ConfluenceLoader(setting)
  }

  async run(): Promise<void> {

    // load users from confluence API
    log(`loading confluence users`)
    const allUsers = await this.loader.loadUsers()
    log(`got confluence users`, allUsers)

    // load users from the database
    const dbUsers = await getRepository(PersonEntity).find({
      settingId: this.setting.id
    })

    // we don't need some confluence users, like system or bot users
    // so we are filtering them out
    log(`filter out users we don't need`)
    const filteredUsers = allUsers.filter(member => {
      const email = member.details.personal.email || ''
      const ignoredEmail = `@connect.atlassian.com`
      return email.substr(ignoredEmail.length * -1) !== ignoredEmail
    })
    log(`users were filtered out`, filteredUsers)

    // create entities for each loaded member
    log('creating person entities from the loaded content')
    const people = filteredUsers.map(user => this.createPerson(dbUsers, user))
    log(`entities created`, people)

    // saving person entities and person bits
    log(`saving entities`, people)
    await getRepository(PersonEntity).save(people)
    await Promise.all(people.map(person => {
      return createOrUpdatePersonBit({
        email: person.data.emails[0],
        name: person.name,
        photo: person.data.avatar,
        integration: person.integration,
        person: person,
      })
    }))
    log(`entities saved`)
  }

  private createPerson(dbUsers: PersonEntity[], user: ConfluenceUser): PersonEntity {
    const id = `confluence-${this.setting.id}-${user.accountId}`
    const person = dbUsers.find(user => user.id === id)
    return assign(person || new PersonEntity(), {
      id,
      integration: 'confluence',
      setting: this.setting,
      integrationId: user.accountId,
      name: user.displayName,
      data: {
        avatar: user.profilePicture.path || '',
        emails: [user.details.personal.email],
        data: {
          github: user,
        },
      } as any
    })
  }

}
