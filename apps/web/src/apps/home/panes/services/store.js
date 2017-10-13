import { without, sortBy, last, countBy, flatten } from 'lodash'
import App, { Thing, Event, Job, CurrentUser } from '~/app'

export default class ServicesStore {
  things = Thing.find()
  jobs = Job.find()
  events = Event.find()

  get types() {
    return without(Object.keys(CurrentUser.setting), 'type').filter(Boolean)
  }

  // creates a map of { 'type:action': job, .. }
  get lastJobs() {
    return flatten(
      this.types.map(type =>
        this.actions(type).map(action => `${type}:${action}`)
      )
    ).reduce((acc, name) => {
      let job = (this.jobs || []).filter(
        ({ type, action }) => `${type}:${action}` === name
      )
      job = last(sortBy(job, 'createdAt'))

      return { ...acc, [name]: job }
    }, {})
  }

  lastSync = (type, action) => {
    this.jobs
    return this.lastJobs[type + ':' + action]
  }

  get countByType() {
    return countBy(this.things, 'integration')
  }

  actions = type => Object.keys(App.sync[type].syncers)

  clearType = async name => {
    const things = await Thing.getAll()
    await Promise.all(
      things.filter(t => t.integration === name).map(t => t.remove())
    )
  }

  clearEverything = async () => {
    await Promise.all((this.things || []).map(t => t.remove()))
    return true
  }
}
