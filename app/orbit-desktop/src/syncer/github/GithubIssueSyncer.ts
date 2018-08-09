import { Bit } from '@mcro/models'
import { omit } from 'lodash'
import { logger } from '@mcro/logger'
import { GithubIssue } from '../../syncer/github/GithubTypes'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { GithubIssueLoader } from './GithubIssueLoader'
import { sequence } from '../../utils'
import { createOrUpdateBit } from '../../helpers/helpers'
import { BitEntity } from '../../entities/BitEntity'
import { SettingEntity } from '../../entities/SettingEntity'

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
    await sequence(repositoryPaths, async repositoryPath => {
      const [organization, repository] = repositoryPath.split('/')
      const loader = new GithubIssueLoader(
        organization,
        repository,
        this.setting.token,
      )
      const issues = await loader.load()
      return Promise.all(issues.map(async issue => {
        createdIssues.push(await this.createIssue(issue, organization, repository))
      }))
    })

    log(`created ${createdIssues.length} issues`, createdIssues)
  }

  async reset(): Promise<void> {

  }

  private async createIssue(
    issue: GithubIssue,
    organization: string,
    repository: string,
  ): Promise<BitEntity> {
    const createdAt = issue.createdAt
      ? new Date(issue.createdAt).getTime()
      : undefined
    const updatedAt = issue.updatedAt
      ? new Date(issue.updatedAt).getTime()
      : undefined
    return await createOrUpdateBit(BitEntity, {
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
    })
  }
}
