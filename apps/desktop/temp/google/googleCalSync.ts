import { Bit, Setting } from '@mcro/models'
import * as _ from 'lodash'
import debug from '@mcro/debug'
import { DriveService } from '@mcro/services'
import { createInChunks } from '~/temp/createInChunks'

const log = debug('sync.googleCal')

export type GoogleCalItem = {
  id: string
  created: string
  updated: string
  organizer: {
    email: string
  }
}

export default class GoogleCalSync {
  setting: Setting
  service: DriveService

  fetch = (path, opts = {}) => this.service.fetch(`/calendar/v3${path}`, opts)
  lastSyncTokens = {}

  constructor(setting) {
    this.setting = setting
    this.service = new DriveService(setting)
  }

  get activeCals() {
    return this.setting.values.calendarsActive
      ? Object.keys(this.setting.values.calendarsActive)
      : []
  }

  run = async () => {
    await this.setupSettings()
    await this.syncAllCalendars()
  }

  async reset() {
    for (const cal of this.activeCals) {
      await this.resetCalendarData(cal)
    }
  }

  async resetCalendarData(calendar: string) {
    const all = await Bit.find({
      integration: 'google',
      type: 'calendar',
      org: calendar,
    })
    if (all) {
      await Promise.all(all.map(item => item.remove()))
    }
  }

  async resetSetting(calendar: string) {
    _.merge(this.setting.values, {
      [calendar]: null,
    })
    await this.setting.save()
  }

  async setupSettings() {
    // @ts-ignore
    const { items } = await this.service.fetch(`/users/me/calendarList`)
    _.merge(this.setting.values, {
      calendars: items,
      calendarsActive: this.setting.values.calendarsActive || {},
      syncTokens: this.setting.values.syncTokens || {},
    })
    await this.setting.save()
  }

  async syncAllCalendars(): Promise<Array<Event>> {
    return _.flatten(await Promise.all(this.activeCals.map(this.syncCalendar)))
  }

  syncCalendar = async (calendar: string): Promise<Array<Event>> => {
    const allEvents = await this.getEvents(calendar)
    log('cal got all events', calendar, allEvents, 'creating...')
    const created = await createInChunks(allEvents, item =>
      this.createEvent(calendar, item),
    )
    log('created events, updating sync token')
    await this.setting.mergeUpdate({
      values: {
        syncTokens: {
          [calendar]: this.lastSyncTokens[calendar],
        },
      },
    })
    return created
  }

  async createEvent(calendar: string, data: GoogleCalItem) {
    const { id, created, updated } = data
    console.log('create event', {
      id,
      integration: 'google',
      type: 'calendar',
      action: '',
      author: data.organizer ? data.organizer.email : '',
      org: calendar,
      parentId: calendar,
      created,
      updated,
      data,
    })
  }

  async getEvents(
    calendarId: string,
    query = {},
    fetchAll = true,
    tries = 0,
  ): Promise<Array<Object>> {
    const finalQuery = { ...query }
    const syncToken = this.setting.values.syncTokens[calendarId]
    if (syncToken) {
      log('using sync token from previous fetch', syncToken)
      // @ts-ignore
      finalQuery.syncToken = syncToken
    }
    const path = `/calendars/${calendarId}/events`
    let lastQuery
    let results = []

    try {
      lastQuery = await this.service.fetch(path, {
        query: {
          maxResults: 2500,
          singleEvents: true,
          ...finalQuery,
        },
      })
      // continue fetching
      results = [...results, ...lastQuery.items]
      if (fetchAll && lastQuery.nextPageToken) {
        results = [
          ...results,
          ...(await this.getEvents(
            calendarId,
            { ...query, pageToken: lastQuery.nextPageToken },
            fetchAll,
            tries,
          )),
        ]
      }
      // store here until we write events and persist
      if (lastQuery.nextSyncToken) {
        this.lastSyncTokens[calendarId] = lastQuery.nextSyncToken
      }
      return results
    } catch (error) {
      if (tries > 0) {
        console.log('out of tries')
        return []
      }
      if (error.code === 410) {
        // fullSyncRequired, clear token
        await this.resetSetting(calendarId)
        // retry
        return await this.getEvents(calendarId, query, fetchAll, tries + 1)
      } else {
        console.log('error with fetch', error)
      }
      return []
    }
  }
}
