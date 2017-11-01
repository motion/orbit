// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class SidebarTitle {
  render({ noBack, icon, subtitle, title, onBack }) {
    return (
      <sidebartitle onClick={onBack}>
        <UI.Button
          if={!noBack}
          $backButton
          size={1}
          circular
          theme="light"
          icon="arrominleft"
          boxShadow="0 0 10px rgba(0,0,0,0.1)"
        />
        <titles>
          <UI.Title ellipse $title size={1.3} fontWeight={600}>
            {title}
          </UI.Title>
          <UI.Title if={subtitle} ellipse size={0.8} opacity={0.5}>
            {subtitle}
          </UI.Title>
        </titles>
        <UI.Icon
          if={icon}
          css={{
            width: 36,
            height: 36,
            marginLeft: 10,
            borderRadius: 100,
            border: [2, [255, 255, 255, 0.2]],
          }}
          name={icon || '/images/me.jpg'}
        />
      </sidebartitle>
    )
  }

  static style = {
    sidebartitle: {
      flexFlow: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      padding: [8, 10],
      margin: [-10, -10],
      flex: 1,
    },
    titles: {
      flex: 1,
      width: '50%',
    },
    backButton: {
      margin: [0, 8, 0, -3],
    },
  }
}
