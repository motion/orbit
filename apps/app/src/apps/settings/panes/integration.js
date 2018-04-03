import * as Panes from './integrationPanes'
import * as React from 'react'
import { view } from '@mcro/black'
import App, { Thing, Event, Job } from '~/app'
import { sortBy, last, countBy, flatten } from 'lodash'
import IntegrationHeader from './integrationPanes/views/header'

@view.provide({
  integrationStore: class IntegrationStore {
    things = Thing.find()
    jobs = Job.find()
    events = Event.find()

    get types() {
      return ['github', 'calendar', 'drive', 'slack', 'pins']
    }

    // creates a map of { 'type:action': job, .. }
    get lastJobs() {
      return flatten(
        this.types.map(type =>
          this.actions(type).map(action => `${type}:${action}`),
        ),
      ).reduce((acc, name) => {
        let job = (this.jobs || []).filter(
          ({ type, action }) => `${type}:${action}` === name,
        )
        job = last(sortBy(job, 'createdAt'))
        return { ...acc, [name]: job }
      }, {})
    }

    lastSync = (type, action) => {
      this.jobs
      return this.lastJobs[type + ':' + action]
    }

    actions = type =>
      App.sync && App.sync[type] ? Object.keys(App.sync[type].syncers) : []
  },
})
@view
export default class IntegrationPane {
  render({ type, integrationStore }) {
    const ActivePane = Panes[type]
    if (!ActivePane) {
      console.error('No ActivePane')
      return null
    }
    return (
      <integration $$flex>
        <IntegrationHeader integrationStore={integrationStore} type={type} />
        <ActivePane integrationStore={integrationStore} />
      </integration>
    )
  }
}
