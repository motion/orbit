import { logger } from '@mcro/logger'
import { Setting } from '@mcro/models'
import { GithubPersonData } from '@mcro/models'
import { uniq } from 'lodash'
import { getRepository } from 'typeorm'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { createOrUpdatePersonBits } from '../../repository'
import { assign } from '../../utils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { GithubPeopleLoader } from './GithubPeopleLoader'
import { GithubPerson } from './GithubTypes'

const log = logger('syncer:github:people')

export class GithubPeopleSyncer implements IntegrationSyncer {
  setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  async run() {
    const repoSettings = this.setting.values.repos
    const repositoryPaths = Object.keys(repoSettings || {})
    const organizations: string[] = uniq(
      repositoryPaths.map(repositoryPath => repositoryPath.split('/')[0]),
    )

    const allPeople: PersonEntity[] = []
    for (let organization of organizations) {
      const loader = new GithubPeopleLoader(organization, this.setting.token)
      const people = await loader.load()
      for (let person of people) {
        await GithubPeopleSyncer.createPerson(this.setting, person)
      }
    }

    log('Created', allPeople ? allPeople.length : 0, 'people', allPeople)
  }

  static async createPerson(setting: Setting, githubPerson: GithubPerson) {

    const id = `github-${setting.id}-${githubPerson.id}`
    const person = (await getRepository(PersonEntity).findOne(id)) || new PersonEntity()
    const data: GithubPersonData = {}

    assign(person, {
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
    await getRepository(PersonEntity).save(person)

    // some people don't have their email exposed, that's why we need this check
    if (githubPerson.email) {
      await createOrUpdatePersonBits(person)
    }

    return person
  }
}
