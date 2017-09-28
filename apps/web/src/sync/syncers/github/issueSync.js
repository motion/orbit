// @flow
import { Thing } from '~/app'
import { createApolloFetch } from 'apollo-fetch'
import { omit, flatten } from 'lodash'
import SyncerAction from '../syncerAction'
import debug from 'debug'

const log = debug('sync')
const issueGet = `
edges {
  node {
    id
    title
    number
    body
    bodyText
    updatedAt
    createdAt
    author {
      avatarUrl
      login
    }
    labels(first: 10) {
      edges {
        node {
          name
        }
      }
    }
    comments(first: 100) {
      edges {
        node {
          author {
            avatarUrl
            login
          }
          createdAt
          body
        }
      }
    }
  }
}
`

const repoGetIssues = `
edges {
  node {
    id
    name
    issues(first: 100) {
      ${issueGet}
    }
  }
}
`

export default class GithubIssueSync extends SyncerAction {
  run = async () => {
    const res = await this.syncOrgs()
    console.log('Created', res ? res.length : 0, 'issues', res)
  }

  syncOrgs = async (orgs: Array<string> = this.setting.activeOrgs) => {
    if (!orgs || !orgs.length) {
      return null
    }
    const issues = await Promise.all(orgs.map(this.syncOrg))
    return flatten(issues).filter(Boolean)
  }

  syncOrg = async (org: string): Promise<Array<Object>> => {
    const repositories = await this.getRepositoriesForOrg(org)
    const issues = flatten(repositories.map(this.getIssuesForRepo))
    return await this.createIssues(org, issues)
  }

  syncRepo = async (org: string, name: string) => {
    const results = await this.graphFetch({
      query: `
      query AllIssues {
        organization(login: "${org}") {
          repository(name: "${name}") {
            ${repoGetIssues}
          }
        }
      }
    `,
    })
    if (!results) {
      return
    }
    const repository = results.data.organization.repository.node
    return await this.createIssues(org, this.getIssuesForRepo(repository))
  }

  createIssues = async (org: string, issues: Array<Object>, chunk = 10) => {
    return await this.createInChunks(
      issues,
      item => this.createIssue(item, org),
      chunk
    )
  }

  getIssuesForRepo = (repository: Object) => {
    return repository.issues.edges.map(edge => ({
      ...edge.node,
      repositoryName: repository.name,
    }))
  }

  unwrapIssue = (obj: Object) => {
    obj.labels = obj.labels.edges.map(edge => edge.node)
    obj.comments = obj.comments.edges.map(edge => edge.node)
    return obj
  }

  createIssue = async (issue: Object, orgLogin: string) => {
    const data = this.unwrapIssue(omit(issue, ['bodyText']))
    const id = `${issue.id}`
    // ensure if one is set, the other gets set too
    const created = issue.createdAt || issue.updatedAt || ''
    const updated = issue.updatedAt || created
    return await Thing.findOrUpdateByTimestamps({
      id,
      integration: 'github',
      type: 'task',
      title: issue.title,
      body: issue.bodyText,
      data,
      orgName: orgLogin,
      parentId: issue.repositoryName,
      created,
      updated,
    })
  }

  getRepositoriesForOrg = async (orgLogin: string): ?Array<Object> => {
    const results = await this.graphFetch({
      query: `
      query AllIssues {
        organization(login: "${orgLogin}") {
          repositories(first: 50) {
            ${repoGetIssues}
          }
        }
      }
    `,
    })
    if (!results) {
      return
    }
    let repositories = results.data.organization.repositories.edges
    if (!repositories || !repositories.length) {
      log('no repos found in response', repositories)
      return null
    }
    repositories = repositories.map(r => r.node)
    return repositories
  }

  apolloFetch = createApolloFetch({
    uri: 'https://api.github.com/graphql',
  }).use(({ request, options }, next) => {
    if (!options.headers) {
      options.headers = {}
    }
    options.headers['Authorization'] = `bearer ${this.token}`
    next()
  })

  async graphFetch(...args) {
    const results = this.apolloFetch(...args)
    if (results.message) {
      console.error('Error doing fetch', results)
      return null
    }
    return results
  }
}
