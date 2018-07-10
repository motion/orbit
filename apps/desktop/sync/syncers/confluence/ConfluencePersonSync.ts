import { Person, Setting, createOrUpdate } from '@mcro/models'
import { flatten } from 'lodash'
import { fetchFromAtlassian } from '../jira/JiraUtils'
import {
  ConfluenceGroupMember,
  ConfluenceGroupMembersResponse,
  ConfluenceGroupResponse,
} from './ConfluenceTypes'

export default class ConfluencePersonSync {
  setting: Setting

  constructor(setting) {
    this.setting = setting
  }

  async run(): Promise<Person[]> {
    try {
      console.log('synchronizing confluence people')
      const people = await this.syncPeople()
      console.log(`created ${people.length} confluence people`, people)
      return people
    } catch (err) {
      console.log('error in confluence people sync', err.message, err.stack)
      return []
    }
  }

  private async syncPeople(): Promise<Person[]> {

    // load groups where from we will extract users
    const url = `/wiki/rest/api/group`;
    console.log('loading confluence groups')
    const groups: ConfluenceGroupResponse = await fetchFromAtlassian(this.setting.values.atlassian, url)
    console.log('confluence groups are loaded', groups.results)

    // now load group members from which we will create people
    console.log('loading confluence members')
    const members: ConfluenceGroupMember[] = flatten(
      await Promise.all(
        groups.results.map(async group => {
          const url = `/wiki/rest/api/group/${group.name}/member`
          const response = await fetchFromAtlassian<ConfluenceGroupMembersResponse>(this.setting.values.atlassian, url);
          return response.results;
        })
      )
    )
    console.log('confluence members are loaded', members)

    // create people for each loaded member
    const people = await Promise.all(members.map(person => this.createPerson(person)))
    return people.filter(x => !!x)
  }

  private async createPerson(member: ConfluenceGroupMember): Promise<Person|null> {
    return await createOrUpdate(
      Person,
      {
        identifier: `confluence-${member.accountId}`,
        integrationId: member.accountId,
        integration: 'confluence',
        name: member.displayName,
        data: {
          avatar: member.profilePicture.path || '',
          emails: [],
          data: {
            github: member,
          },
        },
      },
      { matching: Person.identifyingKeys },
    )
  }

}
