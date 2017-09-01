// @flow
import { store, watch } from '@mcro/black/store'
import { Setting, Thing, Event, Job } from '@mcro/models'
import type { User } from '@mcro/models'
import type { SyncOptions } from '~/types'
import { createApolloFetch } from 'apollo-fetch'
import { omit, once, flatten } from 'lodash'

const withinMinutes = (date, minutes) =>
  Date.now() - Date.parse(date) > minutes * 1000 * 60

@store
export default class GithubSync {
  user: User
  type = 'github'
  syncedPaths = {}

  @watch
  _setting: any = () =>
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

  get setting(): ?Setting {
    return this._setting
  }

  start = async () => {
    if (!this.user.github) {
      console.log('No github credentials found for user')
      return
    }

    // auto-run jobs on startup
    await Promise.all([
      this.ensureJob('issues', { every: 60 * 6 }), // 6 hours
      this.ensureJob('feed', { every: 15 }),
    ])
  }

  ensureJob = async (action: string, options: Object = {}): ?Job => {
    const lastPending = await Job.lastPending({ action }).exec()
    if (lastPending) {
      console.log(`Pending job already running for ${this.type} ${action}`)
      return
    }
    const lastCompleted = await Job.lastCompleted({ action }).exec()
    if (
      !lastCompleted ||
      (options.every && withinMinutes(lastCompleted.updatedAt, options.every))
    ) {
      console.log(
        `Last Run: ${lastCompleted &&
          lastCompleted.updatedAt}, starting new job for ${this.type} ${action}`
      )
      return await Job.create({ type: 'github', action })
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
    // ensure properties on setting
    if (!this.setting.values.lastSyncs) {
      this.setting.values = {
        ...this.setting.values,
        lastSyncs: {},
      }
    }
  }

  runJob = async (action: string) => {
    switch (action) {
      case 'issues':
        return await this.runJobIssues()
      case 'feed':
        return await this.runJobFeed()
    }
  }

  runJobFeed = async () => {
    if (!this.setting) {
      throw Error('No setting')
    }
    if (this.setting.activeOrgs) {
      await Promise.all(this.setting.activeOrgs.map(this.syncFeed))
    }
  }

  writeLastSyncs = async (source: string) => {
    if (!this.setting) {
      throw Error('No setting')
    }
    const syncPaths = this.syncedPaths[source]
    if (syncPaths) {
      this.setting.values.lastSyncs = {
        ...this.setting.values.lastSyncs,
        ...syncPaths,
      }
      await this.setting.save()
    }
  }

  syncFeed = async (orgLogin: string) => {
    console.log('SYNC feed for org', orgLogin)
    const repoEvents = await this.getNewEvents(orgLogin)
    console.log('got events for org', orgLogin, repoEvents)
    await this.insertEvents(repoEvents)
    await this.writeLastSyncs('feed')
  }

  getRepoEvents = async (
    org: string,
    repoName: string,
    page: number = 0
  ): Promise<?Array<Object>> => {
    const events: ?Array<Object> = await this.fetch(
      'feed',
      `/repos/${org}/${repoName}/events?page=${page}`
    )
    // recurse to get older if necessary
    if (events && events.length) {
      const oldestEvent = events[events.length - 1]
      if (!await Event.get(oldestEvent.id)) {
        const previousEvents: Array<Object> = await this.getRepoEvents(
          org,
          repoName,
          page + 1
        )
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
    const repos = await this.fetch('feed', `/orgs/${org}/repos`)
    if (repos) {
      return flatten(
        await Promise.all(repos.map(repo => this.getRepoEvents(org, repo.name)))
      )
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

  runJobIssues = async () => {
    if (!this.setting) {
      throw Error('No setting')
    }
    if (this.setting.activeOrgs) {
      await Promise.all(this.setting.activeOrgs.map(this.syncIssues))
    } else {
      console.log('No orgs selected in settings')
    }
  }

  syncIssues = async (orgLogin: string) => {
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
        console.log('creating issue', issue.id, issue.title)
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

    await Promise.all(createdIssues)
    console.log('Created all issues!', createdIssues.length)
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

  fetch = async (source: string, path: string, opts?: Object) => {
    if (!this.setting) {
      throw Error('No setting')
    }
    this.validateSetting()
    const syncDate = Date.now()
    const response = await fetch(
      `https://api.github.com${path}?access_token=${this.token || ''}`,
      {
        headers: new Headers({
          'If-Modified-Since': this.setting.values.lastSyncs[path],
        }),
        ...opts,
      }
    )
    // if not modified return null
    if (response.status === 304) {
      return null
    }
    this.syncedPaths[source] = {
      ...this.syncedPaths[source],
      [path]: syncDate,
    }
    return response.json()
  }
}
