import { Person, Setting, createOrUpdate } from '@mcro/models'
import getHelpers from './getHelpers'
import debug from '@mcro/debug'
import { flatten } from 'lodash'

const log = debug('sync confluencePerson')

export default class ConfluencePersonSync {
  setting: Setting
  helpers = getHelpers({})

  constructor(setting) {
    this.setting = setting
    this.helpers = getHelpers(setting)
  }

  run = async () => {
    const res = await this.syncPeople()
    if (res.length) {
      console.log('synced')
    }
  }

  syncPeople = async () => {
    const groups = await this.helpers.fetchAll(`/wiki/rest/api/group`)
    console.log('groups', groups)
    if (!groups) {
      console.log('no groups found')
      return null
    }
    const people = flatten(
      await Promise.all(
        groups.map(group =>
          this.helpers.fetchAll(`/wiki/rest/api/group/${group.id}/member`),
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
