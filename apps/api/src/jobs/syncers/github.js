// @flow
import { Setting, Thing, Job } from '@mcro/models'
import type { User } from '@mcro/models'
import type { SyncOptions } from '~/types'
import { createApolloFetch } from 'apollo-fetch'
import { omit } from 'lodash'

type GithubSetting = {
  values: {
    orgs: {
      [string]: boolean,
    },
  },
}

export default class GithubSync {
  user: User
  setting: ?GithubSetting = null

  constructor({ user }: SyncOptions) {
    this.user = user
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

  fetch = (path: string, opts?: Object) =>
    fetch(
      `https://api.github.com${path}?access_token=${this.token || ''}`,
      opts
    ).then(res => res.json())

  get token(): string {
    return (this.user.github && this.user.github.auth.accessToken) || ''
  }

  start = async () => {
    // fetch setting
    this.setting = await Setting.findOne({
      userId: this.user.id,
      type: 'github',
    }).exec()

    // auto-run a job on startup if we have the integration
    const lastRun = await Job.lastCompleted().exec()
    const ONE_HOUR = 1000 * 60 * 60

    // if older than one hour
    if (!lastRun || Date.now() - Date.parse(lastRun.updatedAt) > ONE_HOUR) {
      console.log(
        'It\'s been an hour since last job, check for new stuff on github'
      )
      const jobs = await Job.pending().exec()
      if (this.user.github && !jobs) {
        Job.create({ type: 'github' })
      }
    }
  }

  async dispose() {
    console.log('dispose github syncer')
  }

  run = async (job: Job) => {
    if (!this.token) {
      console.error('No User.github found, changed since sync started?')
      return
    }
    if (!this.setting) {
      console.error('No setting for user and github! :(')
      return
    }

    if (this.setting.values.orgs) {
      for (const login of Object.keys(this.setting.values.orgs)) {
        this.syncIssues(login)
      }
    }
  }

  syncIssues = async (orgLogin: string) => {
    console.log('SYNC issues for org', orgLogin)
    const results = await this.graphFetch({
      query: `
      query AllIssues {
        organization(login: "${orgLogin}") {
          repositories(first: 20) {
            edges {
              node {
                id
                name
                issues(first: 100) {
                  edges {
                    node {
                      id
                      title
                      body
                      bodyText
                      author {
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
                              login
                            }
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
      return
    }

    const repositories = results.data.organization.repositories.edges
    if (!repositories || !repositories.length) {
      console.log('no repos found in response', repositories)
      return
    }

    const createdIssues = []
    const unwrap = obj => {
      obj.labels = obj.labels.edges.map(edge => edge.node)
      obj.comments = obj.comments.edges.map(edge => edge.node)
      return obj
    }

    for (const repositoryNode of repositories) {
      const repository = repositoryNode.node
      const issues = repository.issues.edges.map(edge => edge.node)

      if (!issues || !issues.length) {
        console.log('no issues found for repo', repository.id)
        continue
      }

      for (const issue of issues) {
        const data = unwrap(omit(issue, ['bodyText']))
        console.log('creating issue', issue.title, data)
        createdIssues.push(
          Thing.upsert({
            _id: issue.id,
            integration: 'github',
            type: 'issue',
            title: issue.title,
            body: issue.bodyText,
            data,
            parentId: repository.name,
            givenId: issue.id,
          })
        )
      }
    }

    await Promise.all(createdIssues)
    console.log('Created all issues!', createdIssues.length)
  }
}
