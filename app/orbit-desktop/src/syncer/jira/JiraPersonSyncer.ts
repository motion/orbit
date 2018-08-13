import { Person } from '@mcro/models'
import { PersonEntity } from '../../entities/PersonEntity'
import * as Helpers from '../../helpers'
import { createOrUpdate } from '../../helpers/createOrUpdate'
import { createOrUpdatePersonBit } from '../../repository'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { JiraPeopleResponse, JiraPerson } from './JiraPersonTypes'
import { fetchFromAtlassian } from './JiraUtils'
import { SettingEntity } from '../../entities/SettingEntity'
import { logger } from '@mcro/logger'

const log = logger('syncer:jira:people')

export class JiraPersonSyncer implements IntegrationSyncer {
  private setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  async run(): Promise<void> {
    const people = await this.syncPeople(0)
    log(`created ${people.length} jira people`, people)
  }

  private async syncPeople(startAt: number): Promise<Person[]> {
    const maxResults = 1000
    const url = `/rest/api/2/user/search?maxResults=${maxResults}&startAt=${startAt}&username=_`

    // loading people from atlassian server
    log(
      `loading ${startAt === 0 ? 'first' : 'next'} ${maxResults} people`,
    )
    const result: JiraPeopleResponse = await fetchFromAtlassian(
      this.setting.values.atlassian,
      url,
    )
    log(`${startAt + result.length} people were loaded`, result)

    // create people for each loaded issue
    const people = (await Promise.all(
      result.map(person => this.createPerson(person)),
    )).filter(person => !!person)

    // since we can only load max 1000 people per request, we check if we have more people to load
    // then execute recursive call to load next 1000 people. Since users API does not return total
    // number of users we do recursive queries until it returns less then 1000 people (means end of people)
    if (result.length >= maxResults) {
      const nextPagePeople = await this.syncPeople(startAt + maxResults)
      return [...people, ...nextPagePeople]
    }

    return people
  }

  // todo: do not return null here
  private async createPerson(person: JiraPerson): Promise<Person | null> {
    const id = `jira-${Helpers.hash(person)}`
    const personEntity = await createOrUpdate(
      PersonEntity,
      {
        id,
        integrationId: person.accountId,
        integration: 'jira',
        name: person.displayName,
        data: {
          avatar: person.avatarUrls['48x48'] || '',
          emails: person.emailAddress ? [person.emailAddress] : [],
        },
      },
      { matching: ['id', 'integration'] },
    )

    await createOrUpdatePersonBit({
      email: person.emailAddress,
      name: person.displayName,
      photo: person.avatarUrls['48x48'],
      integration: 'jira',
      person: personEntity,
    })

    return personEntity
  }
}
