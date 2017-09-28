// @flow
import SyncerAction from '../syncerAction'
import { Event } from '~/app'
import debug from 'debug'

const log = debug('sync')

export default class GoogleCalSync extends SyncerAction {
  fetch = (path, opts) => this.helpers.fetch(`/calendar/v3${path}`, opts)

  get activeCals() {
    return this.setting.values.calendarsActive
      ? Object.keys(this.setting.values.calendarsActive)
      : []
  }

  get syncTokens() {
    return this.setting.values.syncTokens || {}
  }

  run = async () => {
    await this.setupSettings()
    await this.syncEvents()
  }

  async setupSettings() {
    const { items } = await this.fetch(`/users/me/calendarList`)
    await this.setting.mergeUpdate({
      values: {
        calendars: items,
        calendarsActive: this.setting.values.calendarsActive || {},
        syncTokens: this.setting.values.syncTokens || {},
      },
    })
  }

  async syncEvents() {
    for (const cal of this.activeCals) {
      const events = await this.getEvents(cal)
      console.log('got events', events)
    }
  }

  async getEvents(calendarId: string, query = {}) {
    const syncToken = this.syncTokens[calendarId]
    if (syncToken) {
      log('using sync token from previous fetch', syncToken)
      query.syncToken = syncToken
    }
    const path = `/calendars/${calendarId}/events`
    const results = await this.fetch(path, {
      query: {
        maxResults: 2500,
        orderBy: 'startTime',
        singleEvents: true,
        ...query,
      },
    })
    if (results.nextPageToken) {
      await this.setting.mergeUpdate({
        values: {
          syncTokens: {
            [path]: results.nextPageToken,
          },
        },
      })
    }
    return results
  }
}
