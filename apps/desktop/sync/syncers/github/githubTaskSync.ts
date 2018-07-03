import { Bit, createOrUpdateBit, Setting } from '@mcro/models'
import { flatten, omit } from 'lodash'
import { GithubIssue, GithubQuery } from './github-query'
import { fetchFromGitHub } from './github-utils'
import getHelpers from './getHelpers'

export class GithubIssueSync {

  setting: Setting
  helpers = getHelpers({})

  constructor(setting: Setting) {
    this.setting = setting
    this.helpers = getHelpers(setting)
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
    const repoNames = repos || Object.keys(repoSettings || {})
    return flatten(
      await Promise.all(
        repoNames.map(repository => {
          const [organization, name] = repository.split('/')
          return this.syncRepo(organization, name)
        })
      )
    ).filter(Boolean)
  }

  private syncRepo = async (
    organization: string,
    repository: string
  ): Promise<Bit[] | undefined> => {

    const results = await fetchFromGitHub(this.setting.token, GithubQuery, {
      organization,
      repository
    })

    if (!results || !results.data) return undefined

    const issues: GithubIssue[] = this.getIssuesForRepo(results.data.organization.repository)
    return Promise.all(issues.map(issue => this.createIssue(issue, organization)))
  }

  private createIssue = async (issue: GithubIssue, orgLogin: string): Promise<Bit> => {
    const data = {
      ...this.unwrapIssue(omit(issue, ['bodyText'])),
      orgLogin
    }
    // ensure if one is set, the other gets set too
    const bitCreatedAt = issue.createdAt || issue.updatedAt || ''
    const bitUpdatedAt = issue.updatedAt || bitCreatedAt
    return await createOrUpdateBit(Bit, {
      integration: 'github',
      identifier: data.id,
      type: 'task',
      title: issue.title,
      body: issue.bodyText,
      data,
      author: issue.author ? issue.author.login : null, // github can return null author in the case if github user was removed
      bitCreatedAt,
      bitUpdatedAt
    })
  }

  // do something with this
  private getIssuesForRepo = (repository: any) => {
    return repository.issues.edges.map(edge => ({
      ...edge.node,
      repositoryName: repository.name
    }))
  }

  // do something with this
  private unwrapIssue = (obj: GithubIssue) => {
    return {
      ...obj,
      labels: obj.labels.edges.map(edge => edge.node),
      comments: obj.comments.edges.map(edge => edge.node)
    }
  }

}
