import { logger } from '@mcro/logger'
import { uniq } from 'lodash'
import { PersonEntity } from '../../entities/PersonEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import * as Helpers from '../../helpers'
import { createOrUpdate } from '../../helpers/createOrUpdate'
import { createOrUpdatePersonBit } from '../../repository'
import { sequence } from '../../utils'
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
    await sequence(organizations, async organization => {
      const loader = new GithubPeopleLoader(organization, this.setting.token)
      const people = await loader.load()
      await Promise.all(people.map(async person => {
        allPeople.push(await this.createPerson(person))
      }))
    })

    log('Created', allPeople ? allPeople.length : 0, 'people', allPeople)
  }

  async reset(): Promise<void> {

  }

  private async createPerson(githubPerson: GithubPerson) {
    const person = {
      location: githubPerson.location || '',
      bio: githubPerson.bio || '',
      avatar: githubPerson.avatarUrl || '',
      emails: githubPerson.email ? [githubPerson.email] : [],
      data: {
        github: githubPerson,
      },
    }
    const id = `github-${Helpers.hash(person)}`
    const personEntity = await createOrUpdate(
      PersonEntity,
      {
        id,
        integrationId: githubPerson.id,
        integration: 'github',
        name: githubPerson.login,
        data: {
          ...person,
        },
      },
      { matching: ['id', 'integration'] },
    )

    if (githubPerson.email) {
      await createOrUpdatePersonBit({
        email: githubPerson.email,
        name: githubPerson.name,
        photo: githubPerson.avatarUrl,
        integration: 'github',
        person: personEntity,
      })
    }

    return personEntity
  }
}
