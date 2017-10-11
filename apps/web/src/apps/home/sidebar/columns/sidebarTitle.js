// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class SidebarTitle {
  render({ data, onBack }) {
    return (
      <title onClick={onBack}>
        <UI.Button $backButton circular icon="arrominleft" />
        <UI.Title size={1.5}>{data.title}</UI.Title>
      </title>
    )
  }

  static style = {
    title: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [5, 10],
    },
    backButton: {
      marginRight: 10,
    },
  }
}
