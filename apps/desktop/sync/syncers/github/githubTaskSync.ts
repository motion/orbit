import { Bit, Setting, createOrUpdate } from '@mcro/models'
import { createApolloFetch } from 'apollo-fetch'
import * as _ from 'lodash'
import debug from '@mcro/debug'
import getHelpers from './getHelpers'

type GithubIssue = {
  id: string
  title: string
  number: number
  body: string
  bodyText: string
  createdAt: string
  updatedAt: string
  author: {
    avatarUrl: string
    login: string
  }
  labels: {
    edges: Array<{ node: { name: string } }>
  }
  comments: {
    edges: Array<{
      node: {
        author: {
          avatarUrl: string
          login: string
        }
        createdAt: string
        body: string
      }
    }>
  }
}

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
    id
    name
    issues(first: 100) {
      ${issueGet}
    }
`

export default class GithubIssueSync {
  setting: Setting
  helpers = getHelpers({})

  get token() {
    return this.setting.token
  }

  constructor(setting: Setting) {
    this.setting = setting
    this.helpers = getHelpers(setting)
  }

  run = async () => {
    try {
      console.log('running github task')
      const res = await this.syncRepos()
      console.log('Created', res ? res.length : 0, 'issues', res)
    } catch (err) {
      console.log('Error in github task sync', err.message, err.stack)
    }
  }

  syncOrgs = async (orgs: Array<string> = this.setting.activeOrgs) => {
    if (!orgs || !orgs.length) {
      return null
    }
    const issues = await Promise.all(orgs.map(this.syncOrg))
    return _.flatten(issues).filter(Boolean)
  }

  syncRepos = async (repos?: Array<string>) => {
    const repoSettings = this.setting.values.repos
    const repoNames = repos || Object.keys(repoSettings || {})
    return _.flatten(
      await Promise.all(
        repoNames.map((repo: string) => {
          const split = repo.split('/')
          return this.syncRepo(split[0], split[1])
        }),
      ),
    ).filter(Boolean)
  }

  syncOrg = async (org: string): Promise<Array<Object>> => {
    const repositories = await this.getRepositoriesForOrg(org)
    const issues = _.flatten(repositories.map(this.getIssuesForRepo))
    return await this.createIssues(org, issues)
  }

  syncRepo = async (org: string, name: string): Promise<any> => {
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

    if (!results || !results.data) {
      return
    }
    const repository = results.data.organization.repository
    return await this.createIssues(org, this.getIssuesForRepo(repository))
  }

  createIssues = async (org: string, issues: Array<GithubIssue>) => {
    return Promise.all(issues.map(issue => this.createIssue(issue, org)))
  }

  getIssuesForRepo = (repository: any) => {
    return repository.issues.edges.map(edge => ({
      ...edge.node,
      repositoryName: repository.name,
    }))
  }

  unwrapIssue = (obj: GithubIssue) => {
    return {
      ...obj,
      labels: obj.labels.edges.map(edge => edge.node),
      comments: obj.comments.edges.map(edge => edge.node),
    }
  }

  createIssue = async (issue: GithubIssue, orgLogin: string) => {
    const data = {
      ...this.unwrapIssue(_.omit(issue, ['bodyText'])),
      orgLogin,
    }
    // ensure if one is set, the other gets set too
    const bitCreatedAt = issue.createdAt || issue.updatedAt || ''
    const bitUpdatedAt = issue.updatedAt || bitCreatedAt
    const body = {
      integration: 'github',
      identifier: `${issue.number}${bitUpdatedAt}`,
      type: 'task',
      title: issue.title,
      body: issue.bodyText,
      data,
      author: issue.author.login,
      bitCreatedAt,
      bitUpdatedAt,
    }
    return await createOrUpdate(Bit, body, Bit.identifyingKeys)
  }

  getRepositoriesForOrg = async (
    orgLogin: string,
  ): Promise<Array<Object> | undefined> => {
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
  }).use(({ options }, next) => {
    if (!options.headers) {
      options.headers = {}
    }
    options.headers['Authorization'] = `bearer ${this.token}`
    next()
  })

  async graphFetch(query) {
    const results = this.apolloFetch(query)
    // @ts-ignore
    if (results.message) {
      console.error('Error doing fetch', results)
      return null
    }
    return results
  }
}
