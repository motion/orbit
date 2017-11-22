import * as Panes from './integrationPanes'
import * as React from 'react'
import { view } from '@mcro/black'
import App, { Thing, Event, Job } from '~/app'
import { sortBy, last, countBy, flatten } from 'lodash'
import IntegrationHeader from './integrationPanes/header'

@view.provide({
  integrationStore: class IntegrationStore {
    things = Thing.find()
    jobs = Job.find()
    events = Event.find()

    get types() {
      return ['github', 'calendar', 'drive', 'slack']
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

    actions = type =>
      App.sync && App.sync[type] ? Object.keys(App.sync[type].syncers) : []

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
  },
})
@view
export default class IntegrationPane {
  render({ type, integrationStore }) {
    const ActivePane = Panes[type]
    return (
      <integration $$flex>
        <IntegrationHeader integrationStore={integrationStore} type={type} />
        <ActivePane integrationStore={integrationStore} />
      </integration>
    )
  }
}
