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
    if (!this.setting.activeOrgs) {
      throw new Error('User hasnt selected any orgs in settings')
    }
    const createdIssues = flatten(
      await Promise.all(this.setting.activeOrgs.map(this.syncIssues))
    ).filter(Boolean)
    console.log(
      'Created',
      createdIssues ? createdIssues.length : 0,
      'issues',
      createdIssues
    )
  }

  syncIssues = async (orgLogin: string): Promise<?Array<Object>> => {
    const results = await this.graphFetch({
      query: `
      query AllIssues {
        organization(login: "${orgLogin}") {
          repositories(first: 50) {
            edges {
              node {
                id
                name
                issues(first: 100) {
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
                }
              }
            }
          }
        }
      }
    `,
    })

    if (results.message) {
      console.error('Error doing fetch', results)
      return null
    }

    const repositories = results.data.organization.repositories.edges
    if (!repositories || !repositories.length) {
      console.log('no repos found in response', repositories)
      return null
    }

    const unwrap = obj => {
      obj.labels = obj.labels.edges.map(edge => edge.node)
      obj.comments = obj.comments.edges.map(edge => edge.node)
      return obj
    }

    let finished = []
    let creating = []

    async function waitForCreating() {
      const successful = (await Promise.all(creating)).map(i => !!i)
      finished = [...finished, ...successful]
      creating = []
    }

    for (const repositoryNode of repositories) {
      const repository = repositoryNode.node
      const issues = repository.issues.edges.map(edge => edge.node)

      if (!issues || !issues.length) {
        continue
      }

      for (const issue of issues) {
        // pause for every 10 to finish
        if (creating.length === 10) {
          await waitForCreating()
        }

        const create = async () => {
          const data = unwrap(omit(issue, ['bodyText']))
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
            parentId: repository.name,
            created,
            updated,
          })
        }

        creating.push(create())
      }
    }

    await waitForCreating()

    return finished
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
