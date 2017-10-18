// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class SidebarTitle {
  render({ title, onBack }) {
    return (
      <sidebartitle onClick={onBack}>
        <UI.Button
          $backButton
          size={1}
          circular
          theme="light"
          icon="arrominleft"
          boxShadow="0 0 10px rgba(0,0,0,0.1)"
        />
        <UI.Title $title size={1.3}>
          {title}
        </UI.Title>
      </sidebartitle>
    )
  }

  static style = {
    sidebartitle: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [8, 20, 8, 0],
      maxWidth: 'calc(100% + 20px)',
      margin: [-10, -10],
    },
    title: {
      display: 'flex',
      flex: 1,
    },
    backButton: {
      margin: [0, 8],
      alignSelf: 'flex-start',
    },
  }
}
