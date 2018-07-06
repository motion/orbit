import { Person, Setting, createOrUpdate } from '@mcro/models'
import getHelpers from './getHelpers'
import debug from '@mcro/debug'

const log = debug('sync githubPeople')

type GithubPerson = {
  id: string
  login: string
  location: string
  bio: string
  avatar_url: string
  email: string
}

export default class GithubPeopleSync {
  setting: Setting
  helpers = getHelpers({})

  constructor(setting) {
    this.setting = setting
    this.helpers = getHelpers(setting)
  }

  run = async () => {
    const orgs = this.setting.orgs
    if (orgs) {
      await Promise.all(orgs.map(this.syncMembers))
    } else {
      log('No orgs selected')
    }
  }

  syncMembers = async (org: string) => {
    const people = await this.helpers.fetch(`/orgs/${org}/members`)
    if (!people) {
      console.log('no people found')
      return null
    }
    const fullPeople = await Promise.all(
      people.map(person => this.helpers.fetch(`/users/${person.login}`)),
    )
    const created = await Promise.all(fullPeople.map(this.createPerson))
    return created.filter(x => !!x)
  }

  createPerson = async (info: GithubPerson) => {
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
