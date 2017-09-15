// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import { HotKeys, OS } from '~/helpers'
import * as UI from '@mcro/ui'
import * as Panes from './panes'
import { Miller, millerStore } from './miller'

const getSchema = () => {
  const val = decodeURIComponent((window.location + '').split('schema=')[1])
  return JSON.parse(val)
}

const PANE_TYPES = {
  main: Panes.Main,
  placeholder: Panes.Placeholder,
  setup: Panes.Setup,
  inbox: Panes.Threads,
  feed: Panes.Feed,
  notifications: Panes.Notifications,
  login: Panes.Login,
  'code.issue': Panes.Code.Issue,
  orbit: Panes.Orbit,
  task: Panes.Task,
  doc: Panes.Doc,
  integrations: Panes.Integrations,
}

@view({
  store: class {
    actions = {
      /*
      cmdW: () => {
        console.log('in cmd w')
        OS.send('close', Constants.APP_KEY)
      },
      down: () => {
        console.log('you pressed down')
      },
      */
    }
  },
})
export default class MasterPage {
  render({ store }) {
    const paneProps = {
      highlightBackground: [0, 0, 0, 0.15],
      highlightColor: [255, 255, 255, 1],
    }

    return (
      <HotKeys handler={store.actions}>
        <UI.Surface flex>
          <UI.Theme name="light">
            <container>
              <UI.Button onClick={this.onClose}>close me</UI.Button>
              <Miller
                animate
                search={''}
                state={store.millerStore}
                panes={PANE_TYPES}
                onChange={store.onmillerStoreChange}
                paneProps={paneProps}
              />
            </container>
          </UI.Theme>
        </UI.Surface>
      </HotKeys>
    )
  }

  static style = {
    container: {
      flex: 1,
    },
  }
}
