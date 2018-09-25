import { PersonEntity, SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { SlackLoader } from '@mcro/services'
import { getRepository } from 'typeorm'
import { PersonSyncer } from '../../utils/PersonSyncer'
import { IntegrationSyncer } from '../../core/IntegrationSyncer'
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

  /**
   * Runs people syncronization.
   */
  async run() {
    log.timer(`load API users`)
    const apiUsers = await this.loader.loadUsers()
    log.timer(`load API users`, apiUsers)

    // filter out bots and strange users without emails
    const filteredApiUsers = apiUsers.filter(user => {
      return user.is_bot === false && user.profile.email
    })
    log.verbose(`filtered API users (non bots)`, filteredApiUsers)

    // creating entities for them
    log.verbose(`finding and creating people for users`, filteredApiUsers)
    const apiPeople = filteredApiUsers.map(user => {
      return this.personFactory.create(user)
    })

    // load all people from the local database
    log.timer(`load synced people from the database`)
    const dbPeople = await this.loadPeople()
    log.timer(`load synced people from the database`, dbPeople)

    // update in the database
    await PersonSyncer.sync(log, apiPeople, dbPeople)
  }

  /**
   * Loads all exist database people for the current integration.
   */
  private loadPeople() {
    return getRepository(PersonEntity).find({
      select: {
        id: true,
        contentHash: true
      },
      where: {
        settingId: this.setting.id
      }
    })
  }

}
