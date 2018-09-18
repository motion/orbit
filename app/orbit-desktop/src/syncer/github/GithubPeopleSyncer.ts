import { Logger } from '@mcro/logger'
import { GithubPersonData, GithubSettingValues, Setting } from '@mcro/models'
import { Person } from '@mcro/models'
import { uniq } from 'lodash'
import { getRepository } from 'typeorm'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { PersonUtils } from '../../utils/PersonUtils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { GithubLoader } from './GithubLoader'
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
    const organizations = this.getOrganizations()

    // if no repositories were selected in settings, we don't do anything
    if (!organizations.length) {
      log.verbose('no repositories were selected in the settings, skip sync')
      return
    } else {
      log.verbose('got organizations to load people from', organizations)
    }

    // get all the people we have in the database for this integration
    log.timer('load synced people from the database')
    const dbPeople = await this.loadDatabasePeople()
    log.timer('load synced people from the database', dbPeople)

    // load people from the API and create entities for them
    log.timer('load API users')
    const apiPeople = await this.loadApiPeople(organizations)
    log.timer('load API users', apiPeople)

    // update in the database
    await PersonUtils.sync(log, apiPeople, dbPeople)
  }

  /**
   * Gets Github Organizations which people we should extract of.
   */
  private getOrganizations(): string[] {
    const values = this.setting.values as GithubSettingValues
    if (!values.repos) {
      log.info('No repos selected, ending')
      return []
    }
    const repositoryPaths = Object.keys(
      values.repos /* || {
      "typeorm/javascript-example": true,
      "typeorm/browser-example": true,
      "typeorm/typeorm": true,
    }*/,
    )
    return uniq(
      repositoryPaths.map(repositoryPath => {
        return repositoryPath.split('/')[0]
      }),
    )
  }

  /**
   * Loads people from the Github API.
   */
  private async loadApiPeople(organizations: string[]) {
    const apiPeople: Person[] = []
    for (let organization of organizations) {
      const organizationPeople = await this.loader.loadPeople(organization)
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
        contentHash: true,
      },
      where: {
        settingId: this.setting.id,
      },
    })
  }
}
