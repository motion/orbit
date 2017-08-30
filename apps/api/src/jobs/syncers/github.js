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

const withinMinutes = (date, minutes) =>
  Date.now() - Date.parse(date) > minutes * 1000 * 60

export default class GithubSync {
  user: User
  type = 'github'
  setting: ?GithubSetting = null

  constructor({ user }: SyncOptions) {
    this.user = user
  }

  get token(): string {
    return (this.user.github && this.user.github.auth.accessToken) || ''
  }

  start = async () => {
    // fetch setting
    this.setting = await Setting.findOne({
      userId: this.user.id,
      type: 'github',
    }).exec()

    if (!this.user.github) {
      console.log('No github credentials found for user')
      return
    }

    // auto-run jobs on startup
    await Promise.all([
      this.ensureJob('issues', { every: 60 }),
      this.ensureJob('feed', { every: 15 }),
    ])
  }

  async dispose() {
    console.log('dispose github syncer')
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

  run = async (job: Job) => {
    if (!this.token) {
      console.error('No User.github found, changed since sync started?')
      return
    }
    if (!this.setting) {
      console.error('No setting for user and github! :(')
      return
    }
    if (job.action) {
      await this.runJob(job.action)
    } else {
      console.log('No action found on job', job.id)
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
    console.log('⭐️ SHOULD BE RUNNING FEED JOB ⭐️')
  }

  runJobIssues = async () => {
    if (!this.setting) {
      console.log('No setting found')
      return
    }
    if (this.setting.values.orgs) {
      await Promise.all(
        Object.keys(this.setting.values.orgs).map(this.syncIssues)
      )
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
