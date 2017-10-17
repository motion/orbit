// @flow
import { Event } from '~/app'
import debug from 'debug'

const log = debug('sync')

export default class GithubFeedSync {
  constructor({ setting, token, helpers }) {
    this.setting = setting
    this.token = token
    this.helpers = helpers
  }

  get repos() {
    return Object.keys(this.setting.values.repos || {}).map(x => x.split('/'))
  }

  run = async () => {
    if (this.repos.length) {
      await Promise.all(
        this.repos.map(([org, repo]) => this.syncFeed(org, repo))
      )
    } else {
      log('No repos selected')
    }
  }

  syncFeed = async (org: string, repo: string) => {
    log('SYNC feed for repo', org, repo)
    const repoEvents = await this.getRepoEvents(org, repo)
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
