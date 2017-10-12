// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class SidebarTitle {
  render({ result, onBack }) {
    return (
      <title onClick={onBack}>
        <UI.Button $backButton size={1.1} circular icon="arrominleft" />
        <UI.Title size={1.6}>{result.title}</UI.Title>
      </title>
    )
  }

  static style = {
    title: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [0, 10],
    },
    backButton: {
      marginRight: 8,
      marginLeft: -15,
    },
  }
}
