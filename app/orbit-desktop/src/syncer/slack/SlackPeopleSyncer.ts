import { Logger } from '@mcro/logger'
import { Person } from '@mcro/models'
import { SlackPersonData } from '@mcro/models'
import { SlackSettingValues } from '@mcro/models'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { createOrUpdatePersonBits } from '../../repository'
import { assign } from '../../utils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { SlackLoader } from './SlackLoader'
import { SlackUser } from './SlackTypes'

const log = new Logger('syncer:slack:people')

/**
 * Syncs Slack people.
 */
export class SlackPeopleSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: SlackLoader
  private people: PersonEntity[]

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new SlackLoader(this.setting)
  }

  async run() {
    log.timer(`load API users`)
    const users = await this.loader.loadUsers()
    log.timer(`load API users`, users)

    // filter out bots and strange users without emails
    const filteredUsers = users.filter(user => {
      return user.is_bot === false && user.profile.email
    })
    log.verbose(`filtered users (non bots)`, filteredUsers)

    // load all people from the local database
    log.timer(`load synced people from the database`)
    this.people = await PersonEntity.find({
      settingId: this.setting.id
    })
    log.timer(`load synced people from the database`, this.people)

    // creating entities for them
    log.verbose(`finding and creating people for users`, filteredUsers)
    const updatedPeople = filteredUsers.map(user => {
      return this.createPerson(user)
    })

    // update in the database
    log.timer(`update people in the database`, updatedPeople)
    await PersonEntity.save(updatedPeople)

    // add person bits
    await Promise.all(
      updatedPeople.map(async person => {
        person.personBit = await createOrUpdatePersonBits(person)
      }),
    )

    log.timer(`update people in the database`)

    // find remove people and remove them from the database
    const removedPeople = this.people.filter(person => {
      return updatedPeople.indexOf(person) === -1
    })
    log.timer(`remove people from the database`, removedPeople)
    await PersonEntity.remove(removedPeople)
    log.timer(`remove people from the database`)
  }

  /**
   * Creates a single integration person from given Slack user.
   */
  private createPerson(user: SlackUser): PersonEntity {
    const id = `slack-${this.setting.id}-${user.id}`
    const person = this.people.find(person => person.id === id)
    const data: SlackPersonData = {
      tz: user.tz
    }
    const values = this.setting.values as SlackSettingValues

    return assign(person || new PersonEntity(), {
      setting: this.setting,
      id: id,
      integration: 'slack',
      integrationId: user.id,
      name: user.profile.real_name || user.name,
      data,
      raw: user,
      webLink: `https://${values.oauth.info.team.id}.slack.com/messages/${user.id}`,
      desktopLink: `slack://user?team=${values.oauth.info.team.id}&id=${user.id}`,
      email: user.profile.email,
      photo: user.profile.image_512,
    })
  }

}
