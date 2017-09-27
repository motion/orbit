// @flow
import SyncerAction from '../syncerAction'

export default class GoogleCalSync extends SyncerAction {
  fetch = (path, opts) => this.helpers.fetch(`/calendar/v3${path}`, opts)

  run = async () => {
    const things = await this.fetch(`/users/me/calendarList`)
    console.log('cal got', things)
  }
}
