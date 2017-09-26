// @flow
import { Event, Setting } from '~/app'
import { flatten } from 'lodash'
import SyncerAction from '../syncerAction'
import debug from 'debug'

const log = debug('sync')

export default class GithubFeedSync extends SyncerAction {
  lastSyncs = {}

  run = async () => {
    if (this.setting.activeOrgs) {
      await Promise.all(this.setting.activeOrgs.map(this.syncFeed))
    } else {
      log('No orgs selected')
    }
  }

  writeLastSyncs = async () => {
    const { lastSyncs } = this
    await this.setting.mergeUpdate({
      values: {
        lastSyncs,
      },
    })
  }

  syncFeed = async (orgLogin: string) => {
    log('SYNC feed for org', orgLogin)
    const repoEvents = await this.getNewEvents(orgLogin)
    const created = await this.insertEvents(repoEvents)
    console.log('Created', created ? created.length : 0, 'feed events', created)
    await this.writeLastSyncs()
  }

  getRepoEventsPage = async (
    org: string,
    repoName: string,
    page: number
  ): Promise<Array<Object>> => {
    const events = await this.fetch(`/repos/${org}/${repoName}/events`, {
      search: { page },
    })
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
      this.fetch(`/orgs/${org}/repos`, { force: true, search: { page } })
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
          console.log('weird thing', lastFetch)
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
    const createdEvents = []
    for (const event of allEvents) {
      const id = `${event.id}`
      const created = event.created_at || ''
      const updated = event.updated_at || created
      // stale event removal
      const stale = await Event.get({ id, created: { $ne: created } })
      if (stale) {
        log('Removing stale event', id)
        await stale.remove()
      }
      if (
        !stale &&
        !await Event.get(updated ? { id, updated } : { id, created })
      ) {
        const inserted = await Event.update({
          id,
          integration: 'github',
          type: event.type,
          author: event.actor.login,
          org: event.org.login,
          parentId: event.repo.name,
          created,
          updated,
          data: event,
        })
        createdEvents.push(inserted)
      }
    }
    return createdEvents
  }

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
        'If-Modified-Since': modifiedSince,
        'If-None-Match': etag,
        ...extraHeaders,
      })
    }
    return new Headers(extraHeaders)
  }

  fetch = async (path: string, options: Object = {}) => {
    const { search, headers, force, ...opts } = options
    // setup options
    const syncDate = Date.now()
    const requestSearch = new URLSearchParams(
      Object.entries({ ...search, access_token: this.token })
    )
    const uri = `https://api.github.com${path}?${requestSearch.toString()}`

    const requestHeaders = force ? null : this.fetchHeaders(uri, headers)
    if (requestHeaders) {
      opts.headers = requestHeaders
    }
    const res = await fetch(uri, opts)

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
      return null
    }

    const text = await res.text()
    return JSON.parse(text)
  }
}
