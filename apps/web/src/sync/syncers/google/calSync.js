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
    // await this.syncEvents()
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
      let allEvents = []
      let gotEvents = true
      while (gotEvents) {
        const events = await this.getEvents(cal)
        gotEvents = events && !!events.length
        if (gotEvents) {
          allEvents = [...allEvents, ...events]
        }
      }
      console.log('got events for', cal, allEvents, 'now need to insert..')
    }
  }

  async getEvents(calendarId: string, query = {}, tries = 0) {
    const syncToken = this.syncTokens[calendarId]
    if (syncToken) {
      log('using sync token from previous fetch', syncToken)
      query.syncToken = syncToken
    }
    const path = `/calendars/${calendarId}/events`
    let results
    try {
      results = await this.fetch(path, {
        query: {
          maxResults: 250,
          singleEvents: true,
          ...query,
        },
      })
    } catch (error) {
      if (tries > 0) {
        console.log('out of tries')
        return null
      }
      if (error.code === 410) {
        // fullSyncRequired, clear token
        await this.setting.mergeUpdate({
          values: {
            syncTokens: {
              [calendarId]: null,
            },
          },
        })
        // retry
        return await this.getEvents(calendarId, query, tries + 1)
      } else {
        console.log('error with fetch', error)
      }
      return null
    }
    if (results.nextPageToken) {
      await this.setting.mergeUpdate({
        values: {
          syncTokens: {
            [calendarId]: results.nextPageToken,
          },
        },
      })
    }
    return results.items
  }
}
