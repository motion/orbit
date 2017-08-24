// @flow
import { Setting, Thing, Job } from '@mcro/models'
import type { User } from '@mcro/models'
import type { SyncOptions } from '~/types'
import { createApolloFetch } from 'apollo-fetch'

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
    console.log('request', request, 'options', options)
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

  get token(): ?string {
    return this.user.github && this.user.github.auth.accessToken
  }

  start = async () => {
    this.setting = await Setting.findOne({
      userId: this.user.id,
      type: 'github',
    }).exec()

    // auto-run a job on startup if we have the integration
    const jobs = await Job.pending().exec()
    if (this.user.github && !jobs) {
      Job.create({ type: 'github' })
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

    for (const login of Object.keys(this.setting.values.orgs)) {
      this.syncOrg(login)
    }
  }

  syncOrg = async (login: string) => {
    const results = await this.graphFetch(`
      query {
        organization(login:"${login}") {
          repositories(first: 20) {
            edges {
              node {
                issues(first: 100) {
                  edges {
                    node {
                      title
                      body
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
    `)

    console.log('resutsl', results)
    const { repositories } = results.query.organization

    if (!repositories || !repositories.length) {
      console.log('no repos found in response', results)
      return
    }

    for (const repository of repositories) {
    }
  }
}
