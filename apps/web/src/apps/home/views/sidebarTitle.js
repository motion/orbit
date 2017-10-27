// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class SidebarTitle {
  render({ icon, subtitle, title, onBack }) {
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
        <titles>
          <UI.Title ellipse $title size={1.3} fontWeight={600}>
            {title}
          </UI.Title>
          <UI.Title if={subtitle} ellipse size={0.8} opacity={0.5}>
            {subtitle}
          </UI.Title>
        </titles>
        <img
          if={icon}
          css={{
            width: 36,
            height: 36,
            borderRadius: 100,
            border: [2, [255, 255, 255, 0.2]],
          }}
          src="/images/me.jpg"
        />
      </sidebartitle>
    )
  }

  static style = {
    sidebartitle: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [8, 0],
      flex: 1,
    },
    titles: {
      flex: 1,
    },
    backButton: {
      margin: [0, 8, 0, -3],
    },
  }
}
