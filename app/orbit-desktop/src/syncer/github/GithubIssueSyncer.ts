import { Bit } from '@mcro/models'
import { flatten, omit } from 'lodash'
import { GithubIssue } from '../../syncer/github/GithubTypes'
import { IntegrationSyncer } from '../core/IntegrationSyncer'
import { GithubIssueLoader } from './GithubIssueLoader'
import { sequence } from '../../utils'
import { createOrUpdateBit } from '../../helpers/helpers'
import { BitEntity } from '../../entities/BitEntity'
import { SettingEntity } from '../../entities/SettingEntity'

export class GithubIssueSyncer implements IntegrationSyncer {
  private setting: SettingEntity

  constructor(setting: SettingEntity) {
    this.setting = setting
  }

  run = async () => {
    try {
      console.log('synchronizing github issues')
      const issues = await this.syncIssues()
      console.log(`created ${issues.length} issues`, issues)
    } catch (err) {
      console.log(
        'error in github issues synchronization',
        err.message,
        err.stack,
      )
    }
  }

  private async syncIssues(repos?: string[]): Promise<Bit[]> {
    const repoSettings = this.setting.values.repos
    const repositoryPaths = repos || Object.keys(repoSettings || {})
    return flatten(
      // @ts-ignore
      sequence(repositoryPaths, async repositoryPath => {
        const [organization, repository] = repositoryPath.split('/')
        const loader = new GithubIssueLoader(
          organization,
          repository,
          this.setting.token,
        )
        const issues = await loader.load()
        return Promise.all(
          issues.map(issue =>
            this.createIssue(issue, organization, repository),
          ),
        )
      }),
    )
  }

  private async createIssue(
    issue: GithubIssue,
    organization: string,
    repository: string,
  ): Promise<Bit> {
    const createdAt = issue.createdAt
      ? new Date(issue.createdAt).getTime()
      : undefined
    const updatedAt = issue.updatedAt
      ? new Date(issue.updatedAt).getTime()
      : undefined
    return await createOrUpdateBit(BitEntity, {
      integration: 'github',
      identifier: issue.id,
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
