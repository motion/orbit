// @flow
import { store } from '@mcro/black/store'
import Syncer from '../syncer'
import GithubFeedSync from './githubFeedSync'
import GithubTaskSync from './githubTaskSync'
import GithubPeopleSync from './githubPeopleSync'
import debug from 'debug'

const log = _ => _ || debug('sync')

@store
export default class GithubSync extends Syncer {
  static settings = {
    type: 'github',
    actions: {
      task: { every: 60 * 5 },
      feed: { every: 30 },
      people: { every: 60 * 5 },
    },
    syncers: {
      task: GithubTaskSync,
      feed: GithubFeedSync,
      people: GithubPeopleSync,
    },
  }

  lastSyncs = {}

  fetchHeaders = (uri: string, extraHeaders: Object = {}) => {
    const lastSync = this.setting.values.lastSyncs[uri]
    if (lastSync && lastSync.date) {
      const modifiedSince = this.helpers.epochToGMTDate(lastSync.date)
      const etag = lastSync.etag ? lastSync.etag.replace('W/', '') : ''
      return new Headers({
        'If-Modified-Since': modifiedSince,
        'If-None-Match': etag,
        ...extraHeaders,
      })
    }
    return new Headers(extraHeaders)
  }

  helpers = {
    fetch: async (path: string, options: Object = {}) => {
      if (!this.token) {
        console.log('no App.sync.github.feed.token')
        return null
      }
      const { search, headers, force, ...opts } = options
      // setup options
      const syncDate = Date.now()
      const requestSearch = new URLSearchParams(
        Object.entries({ ...search, access_token: this.token })
      )
      const uri = `https://api.github.com${path}?${requestSearch.toString()}`

      // ensure lastsyncs
      if (!this.setting.values.lastSyncs) {
        await this.helpers.writeLastSyncs()
      }

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
    },

    epochToGMTDate: (epochDate: number | string): string => {
      const date = new Date(0)
      date.setUTCSeconds(epochDate)
      return date.toGMTString()
    },

    writeLastSyncs: async (lastSyncs = this.lastSyncs) => {
      log('writing', lastSyncs)
      await this.setting.mergeUpdate({
        values: {
          lastSyncs,
        },
      })
    },
  }
}
