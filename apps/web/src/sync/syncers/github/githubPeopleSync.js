// @flow
import { Person } from '~/app'
import debug from 'debug'
import { createInChunks } from '~/sync/helpers'

const log = debug('sync')

export default class GithubPeopleSync {
  constructor({ setting, token, helpers }) {
    this.setting = setting
    this.token = token
    this.helpers = helpers
  }

  run = async () => {
    if (this.setting.activeOrgs) {
      await Promise.all(this.setting.activeOrgs.map(this.syncMembers))
    } else {
      log('No orgs selected')
    }
  }

  syncMembers = async (org: string) => {
    log('SYNC github people')
    const people = await this.helpers.fetch(`/orgs/${org}/members`)
    const fullPeople = await Promise.all(
      people.map(person => this.helpers.fetch(`/users/${person.login}`))
    )
    await createInChunks(fullPeople, this.createPerson)
  }

  createPerson = async (info: Object) => {
    // use email for UID for now
    // use login as github primary id key
    const person = await Person.findOrCreate({
      ids: { $eq: { github: { $eq: info.login } } },
    })
    return await person.mergeUpdate({
      location: info.location || '',
      bio: info.bio || '',
      avatar: info.avatar_url || '',
      emails: info.email ? [info.email] : [],
      data: {
        github: info,
      },
    })
  }
}
