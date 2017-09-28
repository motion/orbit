// @flow
import SyncerAction from '../syncerAction'
import { Event } from '~/app'

export default class GoogleCalSync extends SyncerAction {
  fetch = (path, opts) => this.helpers.fetch(`/calendar/v3${path}`, opts)

  get activeCals() {
    return this.setting.values.calendarsActive
      ? Object.keys(this.setting.values.calendarsActive)
      : []
  }

  run = async () => {
    await this.syncSettings()
    await this.syncEvents()
  }

  async syncSettings() {
    await this.syncCalendarList()
  }

  async syncCalendarList() {
    const { items } = await this.fetch(`/users/me/calendarList`)
    await this.setting.mergeUpdate({
      values: {
        calendars: items,
        calendarsActive: this.setting.values.calendarsActive || {},
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
    const results = await this.fetch(`/calendars/${calendarId}/events`, {
      query: {
        maxResults: 2500,
        orderBy: 'startTime',
        singleEvents: true,
        ...query,
      },
    })
    return results
  }
}
