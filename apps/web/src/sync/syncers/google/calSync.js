// @flow
import SyncerAction from '../syncerAction'

export default class GoogleCalSync extends SyncerAction {
  fetch = (path, opts) => this.helpers.fetch(`/calendar/v3${path}`, opts)

  run = async () => {
    await this.syncSettings()
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
}
