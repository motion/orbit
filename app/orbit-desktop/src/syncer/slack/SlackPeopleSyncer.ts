import { Logger } from '@mcro/logger'
import { Person, SlackPersonData, SlackSettingValues } from '@mcro/models'
import { getRepository } from 'typeorm'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { PersonUtils } from '../../utils/PersonUtils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { SlackLoader } from './SlackLoader'
import { SlackPersonFactory } from './SlackPersonFactory'

const log = new Logger('syncer:slack:people')

/**
 * Syncs Slack people.
 */
export class SlackPeopleSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: SlackLoader
  private personFactory: SlackPersonFactory

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new SlackLoader(this.setting)
    this.personFactory = new SlackPersonFactory(this.setting)
  }

  async run() {
    log.timer(`load API users`)
    const apiUsers = await this.loader.loadUsers()
    log.timer(`load API users`, apiUsers)

    // filter out bots and strange users without emails
    const filteredApiUsers = apiUsers.filter(user => {
      return user.is_bot === false && user.profile.email
    })
    log.verbose(`filtered API users (non bots)`, filteredApiUsers)

    // load all people from the local database
    log.timer(`load synced people from the database`)
    const dbPeople = await this.loadPeople()
    log.timer(`load synced people from the database`, dbPeople)

    // creating entities for them
    log.verbose(`finding and creating people for users`, filteredApiUsers)
    const apiPeople = filteredApiUsers.map(user => {
      return this.personFactory.create(user, dbPeople)
    })

    // update in the database
    await PersonUtils.sync(log, apiPeople, dbPeople)
  }

  /**
   * Loads all exist database people for the current integration.
   */
  private loadPeople() {
    return getRepository(PersonEntity).find({
      where: {
        settingId: this.setting.id
      }
    })
  }

}
