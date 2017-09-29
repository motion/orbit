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
      const allEvents = await this.getEvents(cal)
      log('cal got all events', cal, allEvents, 'creating...')
      const created = await this.createInChunks(allEvents, item =>
        this.createEvent(cal, item)
      )
      log('cal created events', created)
    }
  }

  async createEvent(calendar: string, data: Object) {
    const { id, created, updated } = data
    return await Event.findOrUpdateByTimestamps({
      id,
      integration: 'google',
      type: 'calendar',
      author: data.organizer.email,
      org: calendar,
      parentId: calendar,
      created,
      updated,
      data: event,
    })
  }

  async getEvents(calendarId: string, query = {}, fetchAll = true, tries = 0) {
    let finalQuery = { ...query }
    const syncToken = this.setting.values.syncTokens[calendarId]
    if (syncToken) {
      log('using sync token from previous fetch', syncToken)
      finalQuery.syncToken = syncToken
    }
    const path = `/calendars/${calendarId}/events`
    let lastQuery
    let results = []

    try {
      lastQuery = await this.fetch(path, {
        query: {
          maxResults: 2500,
          singleEvents: true,
          ...finalQuery,
        },
      })
      // continue fetching
      if (lastQuery) {
        results = [...results, ...lastQuery.items]
        if (fetchAll && lastQuery.nextPageToken) {
          results = [
            ...results,
            ...(await this.getEvents(
              calendarId,
              { ...query, pageToken: lastQuery.nextPageToken },
              fetchAll,
              tries
            )),
          ]
        }
      }
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
    if (lastQuery.nextPageToken) {
      await this.setting.mergeUpdate({
        values: {
          syncTokens: {
            [calendarId]: lastQuery.nextPageToken,
          },
        },
      })
    }
    return results
  }
}
