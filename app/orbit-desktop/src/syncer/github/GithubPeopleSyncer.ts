import { logger } from '@mcro/logger'
import { GithubPersonData, GithubSettingValues, Setting } from '@mcro/models'
import { uniq } from 'lodash'
import { getRepository } from 'typeorm'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { createOrUpdatePersonBits } from '../../repository'
import { assign } from '../../utils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { GithubLoader } from './GithubLoader'
import { GithubPerson } from './GithubTypes'

const log = logger('syncer:github:people')

export class GithubPeopleSyncer implements IntegrationSyncer {
  private setting: SettingEntity
  private loader: GithubLoader

  constructor(setting: SettingEntity) {
    this.setting = setting
    this.loader = new GithubLoader(setting)
  }

  async run() {

    // get all organizations from settings we need to sync
    const values = this.setting.values as GithubSettingValues
    const repositoryPaths = Object.keys(values.repos || {})
    const organizations: string[] = uniq(
      repositoryPaths.map(repositoryPath => {
        return repositoryPath.split('/')[0]
      })
    )

    // if no repositories were selected in settings, we don't do anything
    if (!repositoryPaths.length) {
      log(`no repositories were selected in the settings, skip sync`)
      return
    }

    // get all the people we have in the database for this integration
    const existPeople = await getRepository(PersonEntity).find({
      settingId: this.setting.id
    })

    // load people from the API and create entities for them
    const allPeople: PersonEntity[] = []
    for (let organization of organizations) {
      const apiPeople = await this.loader.loadPeople(organization)
      for (let apiPerson of apiPeople) {
        const person = GithubPeopleSyncer.createPerson(this.setting, apiPerson, existPeople)
        const hasSuchPerson = allPeople.some(allPerson => allPerson.id === person.id)
        if (!hasSuchPerson) {
          allPeople.push(person)
        }
      }
    }

    // save entities we got
    log(`saving people`, allPeople)
    await getRepository(PersonEntity).save(allPeople)
    // some people don't have their email exposed, that's why we need this check
    await createOrUpdatePersonBits(allPeople.filter(person => person.email))
    log(`people were saved`)

    // todo: implement people removal
  }

  static createPerson(
    setting: Setting,
    githubPerson: GithubPerson,
    people: PersonEntity[],
  ) {

    const id = `github-${setting.id}-${githubPerson.id}`
    const person = people.find(person => person.id === id)
    const data: GithubPersonData = {}

    return assign(person || new PersonEntity(), {
      id,
      setting: setting,
      integrationId: githubPerson.id,
      integration: 'github',
      name: githubPerson.login,
      webLink: `https://github.com/${githubPerson.login}`,
      email: githubPerson.email,
      photo: githubPerson.avatarUrl,
      raw: githubPerson,
      data
    })
  }
}
