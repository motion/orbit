// @flow
import { store, watch } from '@mcro/black/store'
import { Setting, Thing, Event, Job } from '@mcro/models'
import type { User } from '@mcro/models'
import type { SyncOptions } from '~/types'
import { createApolloFetch } from 'apollo-fetch'
import { omit, once } from 'lodash'

type GithubSetting = {
  values: {
    orgs: {
      [string]: boolean,
    },
  },
}

const withinMinutes = (date, minutes) =>
  Date.now() - Date.parse(date) > minutes * 1000 * 60

@store
export default class GithubSync {
  user: User
  type = 'github'

  @watch
  setting: ?GithubSetting = () =>
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

  get settings(): Object {
    return this.setting || {}
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
        if (this.settings) {
          if (this.settings.activeOrgs) {
            runJob()
          } else {
            console.log('weird no orgs')
          }
        }
      })
    })
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
    console.log('⭐️ SHOULD BE RUNNING FEED JOB ⭐️', this.settings.activeOrgs)
    if (this.settings.activeOrgs) {
      await Promise.all(this.settings.activeOrgs.map(this.syncFeed))
    }
  }

  syncFeed = async (orgLogin: string) => {
    console.log('SYNC feed for org', orgLogin)
    const repos = await this.fetch(`/orgs/${orgLogin}/repos`)
    if (repos) {
      console.log('got repos', repos.length)
      const repoEvents = await Promise.all(
        repos.map(repo => this.fetch(`/repos/${orgLogin}/${repo.name}/events`))
      )

      const createdEvents = []

      for (const events of repoEvents) {
        if (events && events.length) {
          for (const event of events) {
            console.log(
              'Creating events',
              event.id,
              event.type,
              event.repo.name
            )
            createdEvents.push(
              Event.upsert({
                originalId: event.id,
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

      await Promise.all(createdEvents)
      console.log('⭐️⭐️ DONE SYNCING EVENTS ⭐️⭐️')
    }
  }

  runJobIssues = async () => {
    if (this.settings.activeOrgs) {
      await Promise.all(this.settings.activeOrgs.map(this.syncIssues))
    } else {
      console.log('No orgs selected in settings')
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
        console.log('creating issue', issue.id, issue.title)
        createdIssues.push(
          Thing.upsert({
            givenId: issue.id,
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

  fetch = (path: string, opts?: Object) =>
    fetch(
      `https://api.github.com${path}?access_token=${this.token || ''}`,
      opts
    ).then(res => res.json())
}
