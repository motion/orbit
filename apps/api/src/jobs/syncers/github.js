// @flow
import { store, watch } from '@mcro/black/store'
import { Setting, Thing, Event, Job } from '@mcro/models'
import type { User } from '@mcro/models'
import type { SyncOptions } from '~/types'
import { createApolloFetch } from 'apollo-fetch'
import { omit, once, flatten } from 'lodash'
import { URLSearchParams } from 'url'
import { now } from 'mobx-utils'

const olderThan = (date, minutes) => {
  const upperBound = minutes * 1000 * 60
  const timeDifference = Date.now() - Date.parse(date)
  const answer = timeDifference > upperBound
  return answer
}

@store
export default class GithubSync {
  user: User
  type = 'github'
  lastSyncs = {}

  @watch
  setting: any = () =>
    this.user &&
    Setting.findOne({
      userId: this.user.id,
      type: 'github',
      sort: 'createdAt',
    })

  constructor({ user }: SyncOptions) {
    this.user = user
  }

  get token(): string {
    return (this.user.github && this.user.github.auth.accessToken) || ''
  }

  start = async () => {
    if (!this.user.github) {
      console.log('No github credentials found for user')
      return
    }

    // autorun
    this.watch(async () => {
      now(1000 * 60) // every minute
      await Promise.all([
        this.ensureJob('issues', { every: 60 * 6 }), // 6 hours
        this.ensureJob('feed', { every: 15 }),
      ])
    })
  }

  ensureJob = async (action: string, options: Object = {}): ?Job => {
    const lastPending = await Job.lastPending({ action }).exec()
    if (lastPending) {
      console.log(`Pending job already running for ${this.type} ${action}`)
      return
    }
    const lastCompleted = await Job.lastCompleted({ action }).exec()
    const createJob = () => Job.create({ type: 'github', action })
    if (!lastCompleted) {
      return await createJob()
    }
    const ago = Math.round(
      (Date.now() - Date.parse(lastCompleted.updatedAt)) / 1000 / 60
    )
    console.log(`${this.type}.${action} last ran -- ${ago} minutes ago`)
    if (olderThan(lastCompleted.updatedAt, options.every)) {
      return await createJob()
    }
  }

  run = (job: Job) => {
    return new Promise((resolve, reject) => {
      const runJob = once(async () => {
        if (this.setting) {
          this.validateSetting()
          console.log('GithubSetting:', this.setting.toJSON())
        }

        if (job.action) {
          try {
            await this.runJob(job.action)
          } catch (error) {
            reject(error)
          }
          resolve()
        } else {
          reject(`No action found on job ${job.id}`)
        }
      })

      // wait for setting before running
      this.watch(async () => {
        if (this.setting) {
          if (this.setting.activeOrgs) {
            runJob()
          } else {
            console.log('weird no orgs')
          }
        }
      })
    })
  }

  validateSetting = () => {
    // ensures properties on setting
    // TODO move this into GithubSetting model
    if (!this.setting.values.lastSyncs) {
      this.setting.merge({
        values: {
          lastSyncs: {},
        },
      })
    }
  }

  runJob = async (action: string) => {
    switch (action) {
      case 'issues':
        return await this.runIssues()
      case 'feed':
        return await this.runFeed()
    }
  }

  runFeed = async () => {
    if (!this.setting) {
      throw new Error('No setting')
    }
    if (this.setting.activeOrgs) {
      await Promise.all(this.setting.activeOrgs.map(this.syncFeed))
    }
  }

  writeLastSyncs = async () => {
    if (!this.setting) {
      throw new Error('No setting')
    }
    const { lastSyncs } = this
    await this.setting.mergeUpdate({
      values: {
        lastSyncs,
      },
    })
  }

  syncFeed = async (orgLogin: string) => {
    console.log('SYNC feed for org', orgLogin)
    const repoEvents = await this.getNewEvents(orgLogin)
    console.log('got events for org', orgLogin, repoEvents && repoEvents.length)
    const created = await this.insertEvents(repoEvents)
    console.log('Created', created.length, 'feed events')
    await this.writeLastSyncs()
  }

  getRepoEvents = async (
    org: string,
    repoName: string,
    page: number = 0
  ): Promise<?Array<Object>> => {
    const events: ?Array<
      Object
    > = await this.fetch(`/repos/${org}/${repoName}/events`, {
      search: { page },
    })
    // recurse to get older if necessary
    if (events && events.length) {
      const oldestEvent = events[events.length - 1]
      const existingEvent = await Event.get(oldestEvent.id)
      if (!existingEvent) {
        const previousEvents = await this.getRepoEvents(org, repoName, page + 1)
        return [...events, ...previousEvents]
      }
    }
    // weird error format github has
    if (events && !!events.message) {
      console.log(events)
      return null
    }
    return events
  }

  getNewEvents = async (org: string): Promise<Array<Object>> => {
    const repos = await this.fetch(`/orgs/${org}/repos`)
    if (Array.isArray(repos)) {
      return flatten(
        await Promise.all(repos.map(repo => this.getRepoEvents(org, repo.name)))
      ).filter(Boolean)
    } else {
      console.log('No repos', repos)
    }
    return Promise.resolve([])
  }

  insertEvents = (allEvents: Array<Object>): Promise<Array<Object>> => {
    const createdEvents = []
    for (const events of allEvents) {
      if (events && events.length) {
        for (const event of events) {
          createdEvents.push(
            Event.upsert({
              id: `${event.id}`,
              integration: 'github',
              type: event.type,
              author: event.actor.login,
              org: event.org.login,
              parentId: event.repo.name,
              data: event,
            })
          )
        }
      }
    }
    return Promise.all(createdEvents)
  }

  runIssues = async () => {
    if (!this.setting) {
      throw new Error('No setting')
    }
    if (!this.setting.activeOrgs) {
      throw new Error('User hasnt selected any orgs in settings')
    }
    const createdIssues = await Promise.all(
      this.setting.activeOrgs.map(this.syncIssues)
    )
    console.log('Created', createdIssues ? createdIssues.length : 0, 'issues')
  }

  syncIssues = async (orgLogin: string): ?Array<Object> => {
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
        createdIssues.push(
          Thing.upsert({
            id: `${issue.id}`,
            integration: 'github',
            type: 'issue',
            title: issue.title,
            body: issue.bodyText,
            data,
            parentId: repository.name,
          })
        )
      }
    }

    return await Promise.all(createdIssues)
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

  epochToGMTDate = (epochDate: number | string): string => {
    const date = new Date(0)
    date.setUTCSeconds(epochDate)
    return date.toGMTString()
  }

  fetchHeaders = (uri, extraHeaders = {}) => {
    const lastSync = this.setting.values.lastSyncs[uri]
    console.log('got lastSync', lastSync)
    if (lastSync && lastSync.date) {
      const modifiedSince = this.epochToGMTDate(lastSync.date)
      const etag = lastSync.etag ? lastSync.etag.replace('W/', '') : ''
      return new Headers({
        'If-Modified-Since': modifiedSince,
        'If-None-Match': etag,
        ...extraHeaders,
      })
    }
    return new Headers(extraHeaders)
  }

  fetch = async (path: string, { search, headers, ...opts } = {}) => {
    if (!this.setting) {
      throw new Error('No setting')
    }

    // setup options
    this.validateSetting()
    const syncDate = Date.now()
    const requestSearch = new URLSearchParams(
      Object.entries({ ...search, access_token: this.token })
    ).toString()
    const uri = `https://api.github.com${path}?${requestSearch}`
    const requestHeaders = this.fetchHeaders(uri, headers)

    const res = await fetch(uri, {
      headers: requestHeaders,
      ...opts,
    })

    // update lastSyncs
    this.lastSyncs[uri] = {
      date: syncDate,
      etag: res.headers.get('etag'),
      rateLimit: res.headers.get('x-ratelimit-limit'),
      rateLimitRemaining: res.headers.get('x-ratelimit-remaining'),
      rateLimitReset: res.headers.get('x-rate-limit-reset'),
      pollInterval: res.headers.get('x-poll-interval'),
    }

    // if not modified return null
    if (res.status === 304) {
      console.log('Not modified', path)
      return null
    }

    return res.json()
  }
}
