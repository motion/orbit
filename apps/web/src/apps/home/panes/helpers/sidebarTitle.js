// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class SidebarTitle {
  render({ result, onBack }) {
    return (
      <sidebartitle onClick={onBack}>
        <UI.Button
          $backButton
          size={1.4}
          circular
          theme="light"
          icon="arrominleft"
          boxShadow="0 0 10px rgba(0,0,0,0.1)"
        />
        <UI.Title $title size={1.2}>
          {result.title}
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
      padding: [5, 0],
    },
    backButton: {
      marginTop: 5,
      marginRight: 8,
      marginLeft: 5,
      alignSelf: 'flex-start',
    },
  }
}
