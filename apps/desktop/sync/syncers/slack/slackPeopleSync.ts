import { Setting, Bit, Person, createOrUpdate } from '@mcro/models'
import { SlackService } from '@mcro/models/services'
import debug from '@mcro/debug'
import * as Helpers from '~/helpers'

const log = debug('sync slackPeople')

type SlackPerson = {
  id: string
  deleted: boolean
  is_app_user: boolean
  is_bot: boolean
  name: string
  team_id: string
  updated: number
  profile: {
    avatar_hash: string
    display_name: string
    display_name_normalized: string
    email: string
    first_name: string
    image_24: string
    image_32: string
    image_48: string
    image_72: string
    image_192: string
    image_512: string
    last_name: string
    phone: string
    real_name: string
    real_name_normalized: string
    skype: string
    status_emoji: string
    status_expiration: number
    status_text: string
    team: string
    title: string
  }
}

export default class SlackPeopleSync {
  setting: Setting
  service: SlackService

  constructor(setting, service: SlackService) {
    this.setting = setting
    this.service = service
  }

  run = async () => {
    const updated = await this.syncPeople()
    if (updated.length) {
      log(`Slack: synced people ${updated.length}`, updated)
    }
  }

  syncPeople = async () => {
    const { members, cache_ts } = await this.service.slack.users.list()
    const created = []
    for (const member of members) {
      if (await this.updatePerson(member)) {
        created.push(member)
      }
    }
    return created
  }

  updatePerson = async (person: SlackPerson) => {
    return await createOrUpdate(
      Person,
      {
        identifier: `slack-${Helpers.hash(person)}`,
        integration: 'slack',
        name: person.name,
        data: {
          ...person,
        },
      },
      Person.identifyingKeys,
    )
  }
}
