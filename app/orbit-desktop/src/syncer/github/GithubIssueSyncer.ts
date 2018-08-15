import { Bit, Person } from '@mcro/models'
import { omit, uniqBy } from 'lodash'
import { logger } from '@mcro/logger'
import { getRepository } from 'typeorm'
import { PersonEntity } from '../../entities/PersonEntity'
import { GithubIssue } from '../../syncer/github/GithubTypes'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { GithubIssueLoader } from './GithubIssueLoader'
import { createOrUpdateBit } from '../../helpers/helpers'
import { BitEntity } from '../../entities/BitEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { GithubPeopleSyncer } from './GithubPeopleSyncer'

const log = logger('syncer:github:issues')

export class GithubIssueSyncer implements IntegrationSyncer {
  private setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  async run() {

    const createdIssues: BitEntity[] = []
    const repoSettings = this.setting.values.repos
    const repositoryPaths = Object.keys(repoSettings || {})

    // if no repositories were selected in settings, we don't do anything
    if (!repositoryPaths.length) {
      log(`no repositories were selected in the settings, skip sync`)
      return
    }

    // load people, we need them to deal with bits
    // note that people must be synced before this syncer's sync
    log(`loading (already synced) people`)
    const allPeople = await this.loadPeople()

    // if there are no people it means we run this syncer before people sync,
    // postpone syncer execution
    // if (!allPeople.length) {
    //   log(`no people were found, looks like people syncer wasn't executed yet, scheduling restart in 10 seconds`)
    //   await timeout(10000, () => {
    //     log(`restarting people syncer`)
    //     return this.run()
    //   })
    //
    // } else {
    //   log(`loaded people`, allPeople)
    // }

    // sync each repository
    for (let repositoryPath of repositoryPaths) {
      const [organization, repository] = repositoryPath.split('/')
      const loader = new GithubIssueLoader(
        organization,
        repository,
        this.setting.token,
      )
      const issues = await loader.load()
      for (let issue of issues) {
        createdIssues.push(await this.createIssue(issue, organization, repository, allPeople))
      }
    }

    log(`created ${createdIssues.length} issues`, createdIssues)
  }

  /**
   * Loads all people from this integration.
   */
  private loadPeople() {
    return getRepository(PersonEntity).find({
      where: {
        settingId: this.setting.id,
      },
    })
  }

  private async createIssue(
    issue: GithubIssue,
    organization: string,
    repository: string,
    allPeople: Person[],
  ): Promise<BitEntity> {

    const createdAt = new Date(issue.createdAt).getTime()
    const updatedAt = new Date(issue.updatedAt).getTime()
    const comments = issue.comments.edges.map(edge => edge.node)

    const githubPeople = uniqBy([
      issue.author,
      ...comments.map(comment => comment.author)
    ], 'id')

    const people: Person[] = []
    for (let githubPerson of githubPeople) {
      people.push(await GithubPeopleSyncer.createPerson(this.setting, githubPerson))
    }

    return await createOrUpdateBit(BitEntity, {
      setting: this.setting,
      integration: 'github',
      id: issue.id,
      type: 'task',
      title: issue.title,
      body: issue.bodyText,
      webLink: issue.url,
      location: {
        id: issue.repository.id,
        name: issue.repository.name,
        webLink: issue.repository.url,
      },
      data: {
        ...omit(issue, ['bodyText']),
        labels: issue.labels.edges.map(edge => edge.node),
        comments: issue.comments.edges.map(edge => edge.node),
        orgLogin: organization,
        repositoryName: repository,
      },
      author: issue.author ? issue.author.login : null, // github can return null author in the case if github user was removed,
      bitCreatedAt: createdAt,
      bitUpdatedAt: updatedAt,
      people: people,
    })
  }
}
