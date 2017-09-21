// @flow
import { Thing, Setting } from '~/app'
import { createApolloFetch } from 'apollo-fetch'
import { omit, flatten } from 'lodash'

export default class GithubIssueSync {
  setting: Setting
  token: string

  constructor(setting: Setting, token: string) {
    this.setting = setting
    this.token = token
  }

  run = async () => {
    const res = await this.createAllIssues()
    console.log('Created', res ? res.length : 0, 'issues', res)
  }

  createAllIssues = async () => {
    if (!this.setting.activeOrgs) {
      console.log('User hasnt selected any orgs in settings')
      return []
    }
    return flatten(
      await Promise.all(this.setting.activeOrgs.map(this.createIssuesForOrg))
    ).filter(Boolean)
  }

  graphQueryIssue = `
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

  graphQueryRepo = `
    edges {
      node {
        id
        name
        issues(first: 100) {
          ${this.graphQueryIssue}
        }
      }
    }
  `

  getIssuesFromRepo = (repository: Object) => {
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
    // stale removal
    const stale = await Thing.get({ id, created: { $ne: created } })
    if (stale) {
      console.log('Removing stale event', id)
      await stale.remove()
    }
    // already exists
    if (updated && (await Thing.get({ id, updated }))) {
      return false
    }
    return await Thing.update({
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

  createIssuesForOrg = async (orgLogin: string): Promise<Array<Object>> => {
    const repositories = await this.getRepositoriesForOrg(orgLogin)
    const issues = flatten(repositories.map(this.getIssuesFromRepo))
    let finished = []
    let creating = []

    async function waitForCreating() {
      const successful = (await Promise.all(creating)).filter(Boolean)
      finished = [...finished, ...successful]
      creating = []
    }

    for (const issue of issues) {
      // pause for every 10 to finish
      if (creating.length === 10) {
        await waitForCreating()
      }
      creating.push(this.createIssue(issue, orgLogin))
    }

    await waitForCreating()
    return finished
  }

  getRepositoriesForOrg = async (orgLogin: string): ?Array<Object> => {
    const results = await this.graphFetch({
      query: `
      query AllIssues {
        organization(login: "${orgLogin}") {
          repositories(first: 50) {
            ${this.graphQueryRepo}
          }
        }
      }
    `,
    })
    if (results.message) {
      console.error('Error doing fetch', results)
      return null
    }
    let repositories = results.data.organization.repositories.edges
    if (!repositories || !repositories.length) {
      console.log('no repos found in response', repositories)
      return null
    }
    repositories = repositories.map(r => r.node)
    return repositories
  }

  graphFetch = createApolloFetch({
    uri: 'https://api.github.com/graphql',
  }).use(({ request, options }, next) => {
    if (!options.headers) {
      options.headers = {}
    }
    options.headers['Authorization'] = `bearer ${this.token}`
    next()
  })
}
