import { flatten, uniq } from 'lodash'
import { PersonEntity } from '../../entities/PersonEntity'
import * as Helpers from '../../helpers'
import { createOrUpdate } from '../../helpers/createOrUpdate'
import { createOrUpdatePersonBit } from '../../repository'
import { GithubPerson } from './GithubTypes'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { GithubPeopleLoader } from './GithubPeopleLoader'
import { sequence } from '../../utils'
import { SettingEntity } from '../../entities/SettingEntity'
import { logger } from '@mcro/logger'

const log = logger('syncer:github:people')

export class GithubPeopleSyncer implements IntegrationSyncer {
  setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  async run() {
    const people = await this.syncRepos()
    log('Created', people ? people.length : 0, 'people', people)
  }

  async reset(): Promise<void> {

  }

  private async syncRepos(repos?: string[]) {
    const repoSettings = this.setting.values.repos
    const repositoryPaths = repos || Object.keys(repoSettings || {})
    const organizations: string[] = uniq(
      repositoryPaths.map(repositoryPath => repositoryPath.split('/')[0]),
    )
    return flatten(
      // @ts-ignore
      sequence(organizations, async organization => {
        const loader = new GithubPeopleLoader(organization, this.setting.token)
        const people = await loader.load()
        return Promise.all(people.map(person => this.createPerson(person)))
      }),
    )
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
    const identifier = `github-${Helpers.hash(person)}`
    const personEntity = await createOrUpdate(
      PersonEntity,
      {
        identifier,
        integrationId: githubPerson.id,
        integration: 'github',
        name: githubPerson.login,
        data: {
          ...person,
        },
      },
      { matching: ['identifier', 'integration'] },
    )

    if (githubPerson.email) {
      await createOrUpdatePersonBit({
        email: githubPerson.email,
        name: githubPerson.name,
        photo: githubPerson.avatarUrl,
        identifier,
        integration: 'github',
        person: personEntity,
      })
    }

    return personEntity
  }
}
