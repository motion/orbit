import { Setting, createOrUpdate, Person } from '@mcro/models'
import { flatten, uniq } from 'lodash'
import * as Helpers from '~/helpers'
import { createOrUpdatePersonBit } from '~/repository'
import { GithubPeopleLoader } from './GithubPeopleLoader'
import { GithubPerson } from './GithubPeopleQuery'
import { sequence } from '../../../../utils'

export class GithubPeopleSync {

  setting: Setting

  constructor(setting: Setting) {
    this.setting = setting
  }

  run = async () => {
    try {
      console.log('Running github people sync')
      const people = await this.syncRepos()
      console.log('Created', people ? people.length : 0, 'people', people)
    } catch (err) {
      console.log('Error in github people sync', err.message, err.stack)
    }
  }

  private syncRepos = async (repos?: string[]) => {
    const repoSettings = this.setting.values.repos
    const repositoryPaths = repos || Object.keys(repoSettings || {})
    const organizations: string[] = uniq(repositoryPaths.map(repositoryPath => repositoryPath.split('/')[0]));
    return flatten(
      sequence(organizations, async organization => {
        const loader = new GithubPeopleLoader(organization, this.setting.token);
        const people = await loader.load();
        return Promise.all(people.map(person => this.createPerson(person)))
      })
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
      Person,
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
        integration: "github",
        person: personEntity,
      })
    }

    return personEntity
  }

}
