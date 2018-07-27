import { createOrUpdate, Person, Setting } from '@mcro/models'
import * as Helpers from '~/helpers'
import { createOrUpdatePersonBit } from '~/repository'
import { JiraPeopleResponse, JiraPerson } from './JiraPersonTypes'
import { fetchFromAtlassian } from './JiraUtils'

export class JiraPersonSync {
  setting: Setting

  constructor(setting: Setting) {
    this.setting = setting
  }

  async run(): Promise<Person[]> {
    try {
      console.log('synchronizing jira people')
      const people = await this.syncPeople(0)
      console.log(`created ${people.length} jira people`, people)
      return people
    } catch (err) {
      console.log('error in jira people sync', err.message, err.stack)
      return []
    }
  }

  private async syncPeople(startAt: number): Promise<Person[]> {

    const maxResults = 1000;
    const url = `/rest/api/2/user/search?maxResults=${maxResults}&startAt=${startAt}&username=_`;

    // loading people from atlassian server
    console.log(`loading ${startAt === 0 ? 'first' : 'next'} ${maxResults} people`);
    const result: JiraPeopleResponse = await fetchFromAtlassian(this.setting.values.atlassian, url)
    console.log(`${startAt + result.length} people were loaded`, result);

    // create people for each loaded issue
    const people = (await Promise.all(
      result.map(person => this.createPerson(person))
    )).filter(person => !!person)

    // since we can only load max 1000 people per request, we check if we have more people to load
    // then execute recursive call to load next 1000 people. Since users API does not return total
    // number of users we do recursive queries until it returns less then 1000 people (means end of people)
    if (result.length >= maxResults) {
      const nextPagePeople = await this.syncPeople(startAt + maxResults);
      return [...people, ...nextPagePeople];
    }

    return people;
  }

  // todo: do not return null here
  private async createPerson(person: JiraPerson): Promise<Person|null> {
    const identifier = `jira-${Helpers.hash(person)}`
    const personEntity = await createOrUpdate(
      Person,
      {
        identifier,
        integrationId: person.accountId,
        integration: 'jira',
        name: person.displayName,
        data: {
          avatar: person.avatarUrls["48x48"] || '',
          emails: person.emailAddress ? [person.emailAddress] : [],
        },
      },
      { matching: ['identifier', 'integration'] },
    )

    await createOrUpdatePersonBit({
      email: person.emailAddress,
      name: person.displayName,
      photo: person.avatarUrls["48x48"],
      identifier,
      integration: "jira",
      person: personEntity,
    })

    return personEntity
  }
}
