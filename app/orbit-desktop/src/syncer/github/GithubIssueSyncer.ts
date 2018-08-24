import { logger } from '@mcro/logger'
import { Bit, GithubBitData, Person } from '@mcro/models'
import { uniqBy } from 'lodash'
import { getRepository } from 'typeorm'
import { BitEntity } from '../../entities/BitEntity'
import { SettingEntity } from '../../entities/SettingEntity'
import { assign } from '../../utils'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { SyncerUtils } from '../core/SyncerUtils'
import { GithubIssueLoader } from './GithubIssueLoader'
import { GithubPeopleSyncer } from './GithubPeopleSyncer'
import { GithubIssue } from './GithubTypes'

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
    const allPeople = await SyncerUtils.loadPeople(this.setting.id, log)

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
      ...comments.map(comment => comment.author),
    ], 'id').filter(user => !!user)

    const people: Person[] = []
    for (let githubPerson of githubPeople) {
      people.push(await GithubPeopleSyncer.createPerson(this.setting, githubPerson))
    }

    const data: GithubBitData = {
      body: issue.body,
      comments: issue.comments.edges.map(edge => {
        return {
          author: {
            avatarUrl: edge.node.author.avatarUrl,
            login: edge.node.author.login,
          },
          createdAt: edge.node.createdAt,
          body: edge.node.body,
        }
      }),
    }

    const id = `github-${this.setting.id}-${issue.id}`
    let bit = await getRepository(BitEntity).findOne(id)
    if (!bit) bit = new BitEntity()

    assign(bit, {
      id,
      setting: this.setting,
      integration: 'github',
      type: 'task',
      title: issue.title,
      body: issue.bodyText,
      webLink: issue.url,
      location: {
        id: issue.repository.id,
        name: issue.repository.name,
        webLink: issue.repository.url,
        desktopLink: ''
      },
      data,
      raw: issue,
      bitCreatedAt: createdAt,
      bitUpdatedAt: updatedAt,
      people: people,
    })

    return getRepository(BitEntity).save(bit)
  }
}
