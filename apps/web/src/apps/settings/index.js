import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import PaneView from '~/apps/panes/pane'
import * as Panes from './panes'
import App, { Thing, Event, Job } from '~/app'
import { sortBy, last, countBy, flatten } from 'lodash'
import SettingHeader from './panes/header'

@view.provide({
  settingsStore: class SettingsStore {
    activeIndex = 0
    items = [
      { primary: 'Slack', type: 'slack', category: 'Integrations' },
      { primary: 'Github', type: 'github', category: 'Integrations' },
      { primary: 'Google Drive', type: 'drive', category: 'Integrations' },
      {
        primary: 'Google Calendar',
        type: 'calendar',
        category: 'Integrations',
      },
    ]
    get type() {
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
@view
export default class SettingsPage {
  render({ settingsStore }) {
    const ActivePane = Panes[settingsStore.type]
    if (!ActivePane) {
      console.log('nada')
      return null
    }
    return (
      <UI.Theme name="clear-dark">
        <home $$fullscreen>
          <handle
            $$draggable
            css={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 40,
              zIndex: 100,
            }}
          />
          <sidebar $$draggable css={{ paddingTop: 36, width: 280 }}>
            <PaneView
              sidebar
              groupBy="category"
              onSelect={settingsStore.selectItem}
              items={settingsStore.items}
              getItem={(item, index) => ({
                ...item,
                highlight: () => index === settingsStore.activeIndex,
              })}
              itemProps={{
                size: 1.1,
                padding: [8, 12],
                glow: true,
                glowProps: {
                  color: '#fff',
                  scale: 1,
                  blur: 70,
                  opacity: 0.3,
                  show: false,
                  resist: 60,
                  zIndex: -1,
                },
                highlightBackground: [255, 255, 255, 0.1],
                childrenEllipse: 2,
              }}
            />
          </sidebar>
          <UI.Theme name="light">
            <content>
              <SettingHeader type={settingsStore.type} />
              <ActivePane settingsStore={settingsStore} />
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
