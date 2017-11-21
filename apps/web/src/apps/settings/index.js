import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import PaneView from '~/apps/panes/pane'
import * as Panes from './panes'
import App, { Thing, Event, Job } from '~/app'
import { sortBy, last, countBy, flatten } from 'lodash'

@view({
  store: class SettingsStore {
    activeIndex = 0
    items = [
      { primary: 'Slack', type: 'slack' },
      { primary: 'Slack', type: 'slack' },
      { primary: 'Slack', type: 'slack' },
      { primary: 'Slack', type: 'slack' },
    ]
    get paneKey() {
      return this.items[this.activeIndex].type
    }
    selectItem = (result, index) => {
      this.activeIndex = index
    }

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
export default class SettingsPage {
  render({ store }) {
    const ActivePane = Panes[store.paneKey]
    console.log('ActivePane', ActivePane)

    return (
      <UI.Theme name="clear-dark">
        <home $$fullscreen>
          <sidebar css={{ width: 280 }}>
            <PaneView
              sidebar
              groupBy="category"
              onSelect={store.selectItem}
              items={store.items}
              getItem={(item, index) => ({
                ...item,
                highlight: () => index === store.activeIndex,
              })}
              itemProps={{
                size: 1.1,
                padding: [8, 12],
                glow: true,
                glowProps: {
                  color: '#fff',
                  scale: 1,
                  blur: 70,
                  opacity: 0.1,
                  show: false,
                  resist: 60,
                  zIndex: -1,
                },
                highlightBackground: [255, 255, 255, 0.08],
                childrenEllipse: 2,
              }}
            />
          </sidebar>
          <UI.Theme name="light">
            <content>
              <ActivePane settingsStore={store} />
            </content>
          </UI.Theme>
        </home>
      </UI.Theme>
    )
  }

  static style = {
    home: {
      background: [200, 200, 200, 0.45],
      flex: 1,
      flexFlow: 'row',
    },
    content: {
      flex: 1,
      background: '#fff',
      padding: 20,
    },
  }
}
