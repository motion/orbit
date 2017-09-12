// @flow
import { store, watch } from '@mcro/black/store'
import { Setting, Thing, Event, Job } from '@mcro/models'
import typeof { User } from '@mcro/models'
import type { SyncOptions } from '~/types'
import { createApolloFetch } from 'apollo-fetch'
import { omit, once, flatten } from 'lodash'
import { URLSearchParams } from 'url'
import { ensureJob } from '~/jobs/helpers'

const type = 'github'

@store
export default class GithubSync {
  static type = type

  user: User
  lastSyncs = {}

  // oldest setting
  @watch
  setting = () =>
    Setting.findOne({ type, userId: this.user.id }).sort('createdAt')

  constructor({ user }: SyncOptions) {
    this.user = user
  }

  get token(): string {
    return (this.user.github && this.user.github.auth.accessToken) || ''
  }

  start = () => {
    if (!this.user.github) {
      console.log('No github credentials found for user')
      return
    }

    // every so often
    const CHECK_JOBS_TIME = 1000 * 30 // 30 seconds
    setInterval(this.checkJobs, CHECK_JOBS_TIME)
    this.checkJobs()
  }

  checkJobs = async () => {
    await Promise.all([
      ensureJob(type, 'issues', { every: 6 * 60 * 60 }), // 6 hours
      ensureJob(type, 'feed', { every: 60 }), // 60 seconds
    ])
  }

  run = (job: Job): Promise<void> => {
    return new Promise((resolve, reject) => {
      const runJob = once(async () => {
        if (this.setting) {
          this.validateSetting()
        }

        if (job.action) {
          try {
            console.log('running job', job.action)
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
            console.log('no orgs')
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
    console.log('got repo events', repoEvents)
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
      const last = events[events.length - 1]
      const lastEvent = await Event.get(last.id)
      if (!lastEvent) {
        const nextEvents = await this.getRepoEvents(org, repoName, page + 1)
        return [...events, ...nextEvents]
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
      ).filter(x => !!x)
    } else {
      console.log('No repos', repos)
    }
    return Promise.resolve([])
  }

  insertEvents = (allEvents: Array<Object>): Promise<Array<Object>> => {
    const createdEvents = []
    for (const event of allEvents) {
      createdEvents.push(
        Event.update({
          id: `${event.id}`,
          integration: 'github',
          type: event.type,
          author: event.actor.login,
          org: event.org.login,
          parentId: event.repo.name,
          createdAt: event.created_at,
          updatedAt: event.updated_at,
          data: event,
        })
      )
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
    const createdIssues = flatten(
      await Promise.all(this.setting.activeOrgs.map(this.syncIssues))
    )
    console.log('Created', createdIssues ? createdIssues.length : 0, 'issues')
  }

  syncIssues = async (orgLogin: string): Promise<?Array<Object>> => {
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
        console.log('no issues found for repo', repository.name)
        continue
      }

      for (const issue of issues) {
        const data = unwrap(omit(issue, ['bodyText']))
        createdIssues.push(
          Thing.update({
            id: `${issue.id}`,
            integration: 'github',
            type: 'issue',
            title: issue.title,
            body: issue.bodyText,
            data,
            orgName: orgLogin,
            parentId: repository.name,
            createdAt: issue.createdAt,
            updatedAt: issue.updatedAt,
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

  fetchHeaders = (uri: string, extraHeaders: Object = {}) => {
    const lastSync = this.setting.values.lastSyncs[uri]
    if (lastSync && lastSync.date) {
      const modifiedSince = this.epochToGMTDate(lastSync.date)
      const etag = lastSync.etag ? lastSync.etag.replace('W/', '') : ''
      return new Headers({
        // 'If-Modified-Since': modifiedSince,
        // 'If-None-Match': etag,
        ...extraHeaders,
      })
    }
    return new Headers(extraHeaders)
  }

  fetch = async (path: string, options: Object = {}) => {
    const { search, headers, ...opts } = options
    if (!this.setting) {
      throw new Error('No setting')
    }

    // setup options
    this.validateSetting()
    const syncDate = Date.now()
    const requestSearch = new URLSearchParams(
      Object.entries({ ...search, access_token: this.token })
    )
    const uri = `https://api.github.com${path}?${requestSearch.toString()}`
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

    const text = await res.text()
    return JSON.parse(text)
  }
}
