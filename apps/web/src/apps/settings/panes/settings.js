import * as Panes from './settingPanes'
import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { capitalize } from 'lodash'

@view
export default class SettingsPane {
  render({ type }) {
    const ActivePane = Panes[type]
    if (!ActivePane) {
      console.error('No ActivePane')
      return null
    }
    return (
      <pane $$flex>
        <UI.Title size={2.5} fontWeight={800}>
          {capitalize(type)}
        </UI.Title>
        <ActivePane />
      </pane>
    )
  }
}
