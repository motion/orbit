// @flow
import { Event } from '~/app'
import { flatten } from 'lodash'
import debug from 'debug'

const log = debug('sync')

export default class GithubFeedSync {
  constructor({ setting, token, helpers }) {
    this.setting = setting
    this.token = token
    this.helpers = helpers
  }

  run = async () => {
    if (this.setting.activeOrgs) {
      await Promise.all(this.setting.activeOrgs.map(this.syncFeed))
    } else {
      log('No orgs selected')
    }
  }

  syncFeed = async (orgLogin: string) => {
    log('SYNC feed for org', orgLogin)
    const repoEvents = await this.getNewEvents(orgLogin)
    const created = await this.insertEvents(repoEvents)
    console.log(
      'Created',
      created ? created.length : 0,
      'feed events',
      created,
      'for org',
      orgLogin
    )
    await this.helpers.writeLastSyncs()
  }

  getRepoEventsPage = async (
    org: string,
    repoName: string,
    page: number
  ): Promise<Array<Object>> => {
    const events = await this.helpers.fetch(
      `/repos/${org}/${repoName}/events`,
      {
        search: { page },
      }
    )
    if (events && Array.isArray(events)) {
      return events
    }
    return []
  }

  getRepoEvents = async (
    org: string,
    repoName: string,
    page: number = 0
  ): Promise<Array<Object>> => {
    let events = await this.getRepoEventsPage(org, repoName, page)

    if (events && !!events.message) {
      // error format from github
      console.log('error getting events', events)
      return []
    }

    // recurse to get older if necessary
    if (events && events.length) {
      let moreEvents = true
      let last
      while (moreEvents) {
        const prev = last
        last = events[events.length - 1]
        if (prev && last && prev.id === last.id) {
          moreEvents = false
          continue
        }
        const existingLastEvent = await Event.get(last.id)
        if (!existingLastEvent) {
          const nextEvents = await this.getRepoEventsPage(
            org,
            repoName,
            page + 1
          )
          if (nextEvents) {
            if (nextEvents.message) {
              console.log('nextEvents.message', nextEvents.message)
              moreEvents = false
            } else {
              events = [...events, ...nextEvents]
            }
          } else {
            moreEvents = false
          }
        }
      }
    }

    return events
  }

  getAllRepos = async (org: string): Promise<Array<Object>> => {
    const getPage = (page: number) =>
      this.helpers.fetch(`/orgs/${org}/repos`, {
        force: true,
        search: { page },
      })
    let res = []
    let done = false
    let page = 1
    let lastFetch = null
    while (!done) {
      lastFetch = await getPage(page)
      if (!lastFetch) {
        done = true
      } else {
        if (Array.isArray(lastFetch)) {
          if (lastFetch.length < 30) {
            done = true
          }
          page++
          res = [...res, ...lastFetch]
        } else {
          console.error(lastFetch)
          throw new Error('weird thing')
        }
      }
    }
    return res
  }

  getNewEvents = async (org: string): Promise<Array<Object>> => {
    // empty headers to avoid modified header
    const repos = await this.getAllRepos(org)
    if (Array.isArray(repos)) {
      return flatten(
        await Promise.all(repos.map(repo => this.getRepoEvents(org, repo.name)))
      ).filter(x => !!x)
    } else {
      log('No repos', repos)
    }
    return []
  }

  insertEvents = async (allEvents: Array<Object>): Promise<Array<Object>> => {
    const creating = []
    for (const event of allEvents) {
      const id = `${event.id}`
      const created = event.created_at || ''
      const updated = event.updated_at || created
      creating.push(
        Event.findOrUpdate({
          id,
          integration: 'github',
          type: 'issue',
          action: event.type,
          author: event.actor.login,
          org: event.org.login,
          parentId: event.repo.name,
          created,
          updated,
          data: event,
        })
      )
    }
    const all = await Promise.all(creating)
    const created = all.filter(Boolean)
    return created
  }
}
