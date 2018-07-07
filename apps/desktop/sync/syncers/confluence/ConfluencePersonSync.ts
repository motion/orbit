import { Person, Setting, createOrUpdate } from '@mcro/models'
// import debug from '@mcro/debug'
import { flatten } from 'lodash'
import { AtlassianService } from '@mcro/services'

// const log = debug('sync confluencePerson')

export default class ConfluencePersonSync {
  setting: Setting
  service: AtlassianService

  constructor(setting) {
    this.setting = setting
    this.service = new AtlassianService(setting)
  }

  run = async () => {
    const res = await this.syncPeople()
    if (res.length) {
      console.log('synced')
    }
  }

  syncPeople = async () => {
    const groups = await this.service.fetchAll(`/wiki/rest/api/group`)
    console.log('groups', groups)
    if (!groups) {
      console.log('no groups found')
      return null
    }
    const people = flatten(
      await Promise.all(
        groups.map(group =>
          this.service.fetchAll(`/wiki/rest/api/group/${group.id}/member`),
        ),
      ),
    )
    console.log('people', people)
    const created = await Promise.all(people.map(this.createPerson))
    return created.filter(x => !!x)
  }

  createPerson = async info => {
    console.log('createPerson', info)
    const person = {
      location: info.location || '',
      bio: info.bio || '',
      avatar: info.avatar_url || '',
      emails: info.email ? [info.email] : [],
      data: {
        github: info,
      },
    }
    return await createOrUpdate(
      Person,
      {
        identifier: `github-${info.id}`,
        integrationId: info.id,
        integration: 'github',
        name: info.login,
        data: {
          ...person,
        },
      },
      { matching: Person.identifyingKeys },
    )
  }
}
