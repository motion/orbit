import { Person } from '@mcro/models'
import { SlackService } from '@mcro/models/services'
import debug from '@mcro/debug'
import createOrUpdatePerson from './slackCreateOrUpdatePerson'

const log = debug('sync slackPeople')

export default class SlackPeopleSync {
  service: SlackService

  constructor(service: SlackService) {
    this.service = service
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
    // log(`cachets ${cache_ts}`)
    const created = []
    for (const member of members) {
      if (await createOrUpdatePerson(member)) {
        created.push(member)
      }
    }
    return created
  }
}
