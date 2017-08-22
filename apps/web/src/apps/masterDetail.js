// @flow
import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from '~/helpers'
import * as UI from '@mcro/ui'
import * as Panes from './panes'
import { Miller, MillerState } from './miller'

const getSchema = () => {
  const val = decodeURIComponent((window.location + '').split('schema=')[1])
  return JSON.parse(val)
}

@view({
  store: class {
    millerState = MillerState.serialize([getSchema()])
    millerStateVersion = 0

    onMillerStateChange = state => {
      this.millerState = state
      this.millerStateVersion++
    }

    PANE_TYPES = {
      main: Panes.Main,
      placeholder: Panes.Placeholder,
      setup: Panes.Setup,
      inbox: Panes.Threads,
      browse: Panes.Browse,
      feed: Panes.Feed,
      notifications: Panes.Notifications,
      login: Panes.Login,
      'code.issue': Panes.Code.Issue,
      orbit: Panes.Orbit,
      task: Panes.Task,
      doc: Panes.Doc,
      integrations: Panes.Integrations,
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
      <UI.Surface flex>
        <UI.Theme name="light">
          <container>
            <Miller
              animate
              search={''}
              version={store.millerStateVersion}
              state={store.millerState}
              panes={store.PANE_TYPES}
              onChange={store.onMillerStateChange}
              paneProps={paneProps}
            />
          </container>
        </UI.Theme>
      </UI.Surface>
    )
  }

  static style = {
    container: {
      flex: 1,
    },
  }
}
