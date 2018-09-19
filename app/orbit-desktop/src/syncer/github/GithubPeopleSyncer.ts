import { Logger } from '@mcro/logger'
import { GithubPersonData, GithubSettingValues, Person, Setting } from '@mcro/models'
import { getRepository } from 'typeorm'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { GithubLoader } from '../../loaders/github/GithubLoader'
import { GithubOrganization } from '../../loaders/github/GithubTypes'
import { PersonUtils } from '../../utils/PersonUtils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { GithubPersonFactory } from './GithubPersonFactory'

const log = new Logger('syncer:github:people')

export class GithubPeopleSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: GithubLoader
  private personFactory: GithubPersonFactory

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new GithubLoader(setting)
    this.personFactory = new GithubPersonFactory(setting)
  }

  /**
   * Runs people syncronization.
   */
  async run() {

    // get all organizations from settings we need to sync
    const organizations = await this.loader.loadOrganizations()

    // if no repositories were selected in settings, we don't do anything
    if (!organizations.length) {
      log.verbose(`no repositories were selected in the settings, skip sync`)
      return
    } else {
      log.verbose(`got organizations to load people from`, organizations)
    }

    // get all the people we have in the database for this integration
    log.timer(`load synced people from the database`)
    const dbPeople = await this.loadDatabasePeople()
    log.timer(`load synced people from the database`, dbPeople)

    // load people from the API and create entities for them
    log.timer(`load API users`)
    const apiPeople = await this.loadApiPeople(organizations)
    log.timer(`load API users`, apiPeople)

    // update in the database
    await PersonUtils.sync(log, apiPeople, dbPeople)
  }

  /**
   * Loads people from the Github API.
   */
  private async loadApiPeople(organizations: GithubOrganization[]) {
    const apiPeople: Person[] = []
    for (let organization of organizations) {
      const organizationPeople = await this.loader.loadPeople(organization.name)
      for (let organizationPerson of organizationPeople) {
        const person = this.personFactory.create(organizationPerson)
        const hasSuchPerson = apiPeople.some(allPerson => allPerson.id === person.id)
        if (!hasSuchPerson) {
          apiPeople.push(person)
        }
      }
    }
    return apiPeople
  }

  /**
   * Loads all exist database people for the current integration.
   */
  private loadDatabasePeople() {
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
