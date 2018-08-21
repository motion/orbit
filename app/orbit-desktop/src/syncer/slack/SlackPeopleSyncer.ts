import { logger } from '@mcro/logger'
import { Person } from '@mcro/models'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { createOrUpdatePersonBits } from '../../repository'
import { assign } from '../../utils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { SlackLoader } from './SlackLoader'
import { SlackUser } from './SlackTypes'

const log = logger('syncer:slack:people')

/**
 * Syncs Slack people.
 */
export class SlackPeopleSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: SlackLoader

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new SlackLoader(this.setting)
  }

  async run() {
    log(`loading API users`)
    const users = await this.loader.loadUsers()
    log(`users loaded`, users)

    // filter out bots and strange users without emails
    const filteredUsers = users.filter(user => {
      return user.is_bot === false && user.profile.email
    })
    log(`filtered users (non bots)`, filteredUsers)

    // load all people from the local database
    const existPeople = await PersonEntity.find({
      settingId: this.setting.id
    })

    // creating entities for them
    log(`finding and creating people for users`, filteredUsers)
    const updatedPeople = filteredUsers.map(user => {
      return this.createPerson(existPeople, user)
    })

    // update in the database
    log(`updated people`, updatedPeople)
    await PersonEntity.save(updatedPeople)

    // add person bits
    await Promise.all(
      updatedPeople.map(async person => {
        person.personBit = await createOrUpdatePersonBits(person)
      }),
    )

    log(`people were updated`, updatedPeople)

    // find remove people and remove them from the database
    const removedPeople = existPeople.filter(person => {
      return updatedPeople.indexOf(person) === -1
    })
    await PersonEntity.remove(removedPeople)
    log(`people were removed`, removedPeople)
  }

  /**
   * Creates a single integration person from given Slack user.
   */
  private createPerson(people: PersonEntity[], user: SlackUser): PersonEntity {
    const id = `slack-${this.setting.id}-${user.id}`
    const person = people.find(person => person.id === id) || new PersonEntity()

    return assign(person, {
      setting: this.setting,
      id: id,
      integration: 'slack',
      integrationId: user.id,
      name: user.profile.real_name || user.name,
      data: user as any,
      webLink: `https://${this.setting.values.oauth.info.team.id}.slack.com/messages/${user.id}`,
      desktopLink: `slack://user?team=${this.setting.values.oauth.info.team.id}&id=${user.id}`,
      email: user.profile.email,
      photo: user.profile.image_512,
    })
  }

}
