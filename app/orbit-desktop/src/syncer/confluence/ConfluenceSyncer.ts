import { Bit, Person } from '@mcro/models'
import { AtlassianService } from '@mcro/services'
import TurndownService from 'turndown'
import { BitEntity } from '../../entities/BitEntity'
import { PersonEntity } from '../../entities/PersonEntity'
import { createOrUpdatePersonBit } from '../../repository'
import { fetchFromAtlassian } from '../../syncer/jira/JiraUtils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import {
  AtlassianObj,
  ConfluenceGroupMembersResponse,
  ConfluenceGroupResponse,
  ConfluenceUser,
} from './ConfluenceTypes'
import { SettingEntity } from '../../entities/SettingEntity'

export class ConfluenceSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private service: AtlassianService
  private people: Person[]

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.service = new AtlassianService(setting)
  }

  async run(): Promise<void> {
    try {
      console.log('synchronizing confluence people')
      this.people = await this.syncPeople()
      if (!this.people) {
        console.log('no people returned...')
        return
      }
      console.log(
        `created ${this.people.length} confluence people`,
        this.people,
      )

      console.log('running confluence')
      const result = await this.syncBits()
      console.log(
        'Created',
        result ? result.length : 0,
        'confluence items',
        result,
      )
    } catch (err) {
      console.log('Error in confluence task sync', err.message, err.stack)
    }
  }

  async syncBits(): Promise<Bit[]> {
    const contentList = await this.service.fetchAll(`/wiki/rest/api/content`)
    if (!contentList) {
      console.log('no content found')
      return null
    }
    const contents = await Promise.all(
      contentList.map(content =>
        this.service.fetch(`/wiki/rest/api/content/${content.id}`, {
          expand: 'space,body.storage,history,history.lastUpdated',
        }),
      ),
    )
    console.log(`loaded content`, contents)

    const turndown = new TurndownService()
    const htmlToMarkdown = html => turndown.turndown(html)
    const contentsRendered = contents.map(response => {
      const markdownBody = htmlToMarkdown(response.body.storage.value)
      const body = markdownBody.replace(/\s\s+/g, ' ')
      return { body, markdownBody, response }
    })
    return await this.createIssues(contentsRendered)
  }

  private async createIssues(issues: AtlassianObj[]): Promise<Bit[]> {
    const results = await Promise.all(
      issues.map(issue => this.createIssue(issue)),
    )
    return results.filter(Boolean)
  }

  createIssue = async ({
    response,
    markdownBody,
    body,
  }: AtlassianObj): Promise<Bit> => {
    const integration = 'confluence'
    const identifier = response.id
    const bitCreatedAt = new Date(response.history.createdDate).getTime()
    const bitUpdatedAt = new Date(response.history.lastUpdated.when).getTime()

    const bit = await BitEntity.findOne({ integration, identifier })
    const updatedBit = Object.assign(bit || new BitEntity(), {
      integration,
      identifier,
      type: 'document',
      title: response.title,
      body,
      data: {
        ...response,
        markdownBody,
      },
      location: {
        id: response.space.id,
        name: response.space.name,
        webLink: response._links.base + response.space._links.webui,
      },
      webLink: response._links.base + response._links.webui,
      author:
        response.history.createdBy.displayName ||
        response.history.createdBy.username,
      bitCreatedAt,
      bitUpdatedAt,
    })
    await updatedBit.save()

    const person = this.people.find(person => {
      const identifier = `confluence-${response.history.createdBy.accountId}`
      return person.identifier === identifier
    })
    console.log(`found a person`, person)
    if (person) {
      if (!person.personBit.bits) person.personBit.bits = []

      const hasSuchBit = person.personBit.bits.some(bit => {
        return bit.identifier === identifier && bit.integration === integration
      })
      console.log(`don't have such bit`)
      if (!hasSuchBit) {
        // @ts-ignore
        person.personBit.bits.push(updatedBit)
        // @ts-ignore
        await person.personBit.save()
      }
    }

    // @ts-ignore
    return updatedBit
  }

  private async syncPeople(): Promise<Person[]> {
    // load groups where from we will extract users
    console.log('loading confluence groups')
    const groups: ConfluenceGroupResponse = await fetchFromAtlassian(
      this.setting.values.atlassian,
      `/wiki/rest/api/group`,
    )
    if (!groups) {
      console.log('error no groupd returned')
      return
    }
    console.log('confluence groups are loaded', groups.results)

    // now load group members from which we will create people
    console.log('loading confluence members')
    const users: ConfluenceUser[] = []
    await Promise.all(
      groups.results.map(async group => {
        const response = await fetchFromAtlassian<
          ConfluenceGroupMembersResponse
        >(
          this.setting.values.atlassian,
          `/wiki/rest/api/group/${group.name}/member`,
        )
        await Promise.all(
          response.results.map(async member => {
            const user = await fetchFromAtlassian<ConfluenceUser>(
              this.setting.values.atlassian,
              `/wiki/rest/api/user?accountId=` +
                member.accountId +
                '&expand=operations,details.personal',
            )
            users.push(user)
          }),
        )
      }),
    )

    // create people for each loaded member
    return Promise.all(users.map(person => this.createPerson(person)))
  }

  private async createPerson(user: ConfluenceUser): Promise<Person> {
    const identifier = `confluence-${user.accountId}`
    const integration = 'confluence'
    const person = await PersonEntity.findOne(
      { identifier, integration },
      // @ts-ignore
      { relations: ['personBit', 'personBit.bits'] },
    )
    const updatedPerson = Object.assign(person || new PersonEntity(), {
      integration,
      identifier,
      integrationId: user.accountId,
      name: user.displayName,
      data: {
        avatar: user.profilePicture.path || '',
        emails: [user.details.personal.email],
        data: {
          github: user,
        },
      },
    })

    await PersonEntity.save(updatedPerson)

    // todo: we already have person bit loaded in the person, we don't need to load it again
    updatedPerson.personBit = await createOrUpdatePersonBit({
      email: user.details.personal.email,
      name: user.displayName,
      photo: user.profilePicture.path,
      identifier,
      integration,
      person: updatedPerson,
    })

    return updatedPerson
  }
}
