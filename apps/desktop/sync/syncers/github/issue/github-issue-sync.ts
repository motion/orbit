import { Bit, createOrUpdateBit, Setting } from '@mcro/models'
import { flatten, omit } from 'lodash'
import { GithubIssue } from './github-issue-query'
import { GithubIssueLoader } from './github-issue-loader'
import { sequence } from '../../../../utils'

export class GithubIssueSync {

  setting: Setting

  constructor(setting: Setting) {
    this.setting = setting
  }

  run = async () => {
    try {
      console.log('running github task')
      const repositories = await this.syncRepos()
      console.log('Created', repositories ? repositories.length : 0, 'issues', repositories)
    } catch (err) {
      console.log('Error in github task sync', err.message, err.stack)
    }
  }

  private syncRepos = async (repos?: string[]) => {
    const repoSettings = this.setting.values.repos
    const repositoryPaths = repos || Object.keys(repoSettings || {})
    return flatten(
      sequence(repositoryPaths, async repositoryPath => {
        const [organization, repository] = repositoryPath.split('/')
        const loader = new GithubIssueLoader(organization, repository, this.setting.token);
        const issues = await loader.load();
        return Promise.all(issues.map(issue => this.createIssue(issue, organization, repository)))
      })
    )
  }

  private createIssue = async (issue: GithubIssue, organization: string, repository: string): Promise<Bit> => {
    const data /* : create type for it */ = {
      ...omit(issue, ['bodyText']),
      labels: issue.labels.edges.map(edge => edge.node),
      comments: issue.comments.edges.map(edge => edge.node),
      orgLogin: organization,
      repositoryName: repository
    }
    // ensure if one is set, the other gets set too
    const bitCreatedAt = issue.createdAt || issue.updatedAt || ''
    const bitUpdatedAt = issue.updatedAt || bitCreatedAt
    const author = issue.author ? issue.author.login : null // github can return null author in the case if github user was removed
    return await createOrUpdateBit(Bit, {
      integration: 'github',
      identifier: data.id,
      type: 'task',
      title: issue.title,
      body: issue.bodyText,
      data,
      author,
      bitCreatedAt,
      bitUpdatedAt
    })
  }

}
