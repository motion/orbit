import { Setting, Person } from '@mcro/models'
import { SlackService } from '@mcro/services'
import debug from '@mcro/debug'
import createOrUpdatePerson from './slackCreateOrUpdatePerson'

const log = debug('sync slackPeople')

export default class SlackPeopleSync {
  setting: Setting
  service: SlackService

  constructor(setting: Setting) {
    this.setting = setting
    this.service = new SlackService(this.setting)
  }

  run = async () => {
    const updated = await this.syncPeople()
    if (updated.length) {
      log(`Slack: synced people ${updated.length}`, updated)
    }
  }

  reset = async () => {
    const people = await Person.find({ integration: 'slack' })
    await Promise.all(people.map(person => person.remove()))
  }

  syncPeople = async () => {
    const { members, cache_ts } = await this.service.slack.users.list()
    console.log('found', members)
    log(`cachets ${cache_ts}`)
    const created = []
    for (const member of members) {
      if (await createOrUpdatePerson(member)) {
        created.push(member)
      }
    }
    return created
  }
}
