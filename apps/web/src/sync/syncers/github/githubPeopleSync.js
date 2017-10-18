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
    const orgs = this.setting.orgs
    if (orgs) {
      await Promise.all(orgs.map(this.syncMembers))
    } else {
      log('No orgs selected')
    }
  }

  syncMembers = async (org: string) => {
    log('SYNC github people', org)
    const people = await this.helpers.fetch(`/orgs/${org}/members`)
    if (!people) {
      console.log('no people found')
      return null
    }
    const fullPeople = await Promise.all(
      people.map(person => this.helpers.fetch(`/users/${person.login}`))
    )
    return await createInChunks(fullPeople, this.createPerson)
  }

  createPerson = async (info: Object) => {
    // use email for UID for now
    // use login as github primary id key
    let person = await Person.findOne()
      .where('ids.github')
      .eq(info.login)
      .exec()

    if (!person) {
      person = await Person.create({
        ids: { github: info.login },
      })
    }

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
