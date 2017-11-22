// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class SidebarTitle {
  render({ image, backProps, noBack, icon, subtitle, title, onBack }) {
    return (
      <sidebartitle onClick={e => e.stopPropagation()}>
        <UI.Button
          if={false && !noBack}
          $backButton
          size={0.9}
          circular
          theme="light"
          icon="arrominleft"
          boxShadow="0 0 10px rgba(0,0,0,0.1)"
          onClick={onBack}
          {...backProps}
        />
        <titles>
          <UI.Title ellipse={2} size={1.1} fontWeight={400} opacity={0.9}>
            {title}
          </UI.Title>
          <UI.Title if={subtitle} ellipse size={0.8} opacity={0.5}>
            {subtitle}
          </UI.Title>
        </titles>
        <img if={image} $image src={image} />
        <UI.Icon if={icon} $image name={icon || '/images/me.jpg'} />
      </sidebartitle>
    )
  }

  static style = {
    image: {
      width: 24,
      height: 24,
      borderRadius: 100,
      border: [2, [255, 255, 255, 0.2]],
      marginLeft: 10,
    },
    sidebartitle: {
      flexFlow: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      padding: [10, 10],
      borderBottom: [1, [255, 255, 255, 0.05]],
      // background: [255, 255, 255, 0.05],
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
